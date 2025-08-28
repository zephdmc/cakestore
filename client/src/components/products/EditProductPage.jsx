import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, updateProduct } from '../../services/productServic';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, storage } from '../../firebase/config';

// REPLACED: Skincare categories with Cake Shop categories
const CAKE_CATEGORIES = [
    'Birthday Cakes',
    'Wedding Cakes',
    'Cupcakes',
    'Cheesecakes',
    'Custom Cakes',
    'Seasonal Specials',
    'Desserts',
    'Cookie Boxes'
];

// NEW: Dietary tags for filtering
const DIETARY_TAGS = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Contains Nuts',
    'Egg-Free',
    'Sugar-Free'
];

// NEW: Flavor tags for filtering
const FLAVOR_TAGS = [
    'Chocolate',
    'Vanilla',
    'Red Velvet',
    'Fruit',
    'Carrot',
    'Lemon',
    'Coffee',
    'Cheesecake'
];

export default function EditProductPage() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        countInStock: '',
        images: [], // CHANGED: Now an array
        ingredients: [], // CHANGED: Now an array
        dietaryTags: [], // REPLACED: skinType with dietaryTags (array)
        size: '',
        flavorTags: [], // REPLACED: benefits with flavorTags (array)
        discountPercentage: '',
        isCustom: false, // NEW: Flag for custom cakes
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [expectedPrice, setExpectedPrice] = useState('');
    const [ingredientInput, setIngredientInput] = useState(''); // NEW: For adding ingredients
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id);
                const product = response.data;
                
                setFormData({
                    name: product.name || '',
                    price: product.price || '',
                    description: product.description || '',
                    category: product.category || '',
                    countInStock: product.countInStock || '',
                    images: product.images || [], // CHANGED: Now array
                    ingredients: product.ingredients || [], // CHANGED: Now array
                    dietaryTags: product.dietaryTags || [], // CHANGED: Now array
                    size: product.size || '',
                    flavorTags: product.flavorTags || [], // CHANGED: Now array
                    discountPercentage: product.discountPercentage || '',
                    isCustom: product.isCustom || false, // NEW: Custom flag
                });
                
                // Calculate initial expected price if discount exists
                if (product.discountPercentage && product.price) {
                    const price = parseFloat(product.price) || 0;
                    const discount = parseFloat(product.discountPercentage) || 0;
                    const calculatedPrice = price - (price * (discount / 100)); // FIXED: Discount subtracts
                    setExpectedPrice(calculatedPrice.toFixed(2));
                }
            } catch (err) {
                setError('Failed to load product details');
            } finally {
                setFetching(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isNaN(formData.price) || isNaN(formData.countInStock)) {
                throw new Error('Price and stock must be valid numbers');
            }

            // Ensure we have at least one image for non-custom products
            if (!formData.isCustom && formData.images.length === 0) {
                throw new Error('Please upload at least one product image');
            }

            const productToUpdate = {
                ...formData,
                price: parseFloat(formData.price),
                countInStock: parseInt(formData.countInStock),
                discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : 0,
                // Arrays are already set in state
            };

            const response = await updateProduct(id, productToUpdate);
            
            if (response.success) {
                setSuccess(response.message || 'Product updated successfully!');
                setTimeout(() => navigate('/admin/products'), 1500);
            } else {
                throw new Error(response.message || 'Update failed on server');
            }

        } catch (err) {
            const errorMessage = err.response?.message ||
                err.message ||
                'Failed to update product';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Handle checkbox separately
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
            return;
        }
        
        setFormData(prev => {
            const updatedData = { ...prev, [name]: value };
            
            // Calculate expected price when either price or discount changes
            if (name === 'price' || name === 'discountPercentage') {
                const price = parseFloat(updatedData.price) || 0;
                const discount = parseFloat(updatedData.discountPercentage) || 0;
                const calculatedPrice = price - (price * (discount / 100));
                setExpectedPrice(calculatedPrice.toFixed(2));
            }
            
            return updatedData;
        });
    };

    // NEW: Function to handle array-based fields (dietaryTags, flavorTags)
    const handleArrayChange = (field, value, isChecked) => {
        setFormData(prev => {
            const currentArray = prev[field] || [];
            let newArray;
            
            if (isChecked) {
                // Add to array if checked
                newArray = [...currentArray, value];
            } else {
                // Remove from array if unchecked
                newArray = currentArray.filter(item => item !== value);
            }
            
            return { ...prev, [field]: newArray };
        });
    };

    // NEW: Function to add ingredient from input
    const addIngredient = () => {
        if (ingredientInput.trim()) {
            setFormData(prev => ({
                ...prev,
                ingredients: [...prev.ingredients, ingredientInput.trim()]
            }));
            setIngredientInput('');
        }
    };

    // NEW: Function to remove ingredient
    const removeIngredient = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, index) => index !== indexToRemove)
        }));
    };

    // MODIFIED: Now handles multiple image uploads
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        try {
            setLoading(true);
            const newImageUrls = [];

            for (const file of files) {
                const filename = `products/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
                const storageRef = ref(storage, filename);
                
                const snapshot = await uploadBytes(storageRef, file, {
                    contentType: file.type,
                    customMetadata: {
                        uploadedBy: auth.currentUser?.uid || 'admin'
                    }
                });
                
                const downloadURL = await getDownloadURL(snapshot.ref);
                newImageUrls.push(downloadURL);
            }

            setFormData(prev => ({ 
                ...prev, 
                images: [...prev.images, ...newImageUrls] 
            }));
            
        } catch (err) {
            console.error("Upload error:", err);
            setError('Image upload failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // NEW: Function to remove an image
    const removeImage = async (indexToRemove, imageUrl) => {
        try {
            // Optional: Delete the image from Firebase Storage
            // const imageRef = ref(storage, imageUrl);
            // await deleteObject(imageRef);
            
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter((_, index) => index !== indexToRemove)
            }));
        } catch (err) {
            console.error("Error removing image:", err);
            setError('Error removing image');
        }
    };

    if (fetching) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-4xl">
            <div className="flex items-center mb-4 sm:mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-2 sm:mr-4 p-1 sm:p-2 rounded-full hover:bg-gray-100"
                    aria-label="Go back"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Cake Product</h2> {/* CHANGED: Title */}
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="text-red-700 text-sm sm:text-base">{error}</p>
                </div>
            )}
            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="text-green-700 text-sm sm:text-base">{success}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Product Name */}
                    <div className="col-span-1 md:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="e.g. Chocolate Fudge Cake"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Price (₦) *
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₦</span>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="w-full pl-8 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Discount Percentage */}
                    <div>
                        <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                            Discount Percentage (%)
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">%</span>
                            <input
                                type="number"
                                id="discountPercentage"
                                name="discountPercentage"
                                min="0"
                                max="100"
                                step="0.01"
                                value={formData.discountPercentage}
                                onChange={handleChange}
                                className="w-full pl-8 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Expected Price (read-only) */}
                    <div>
                        <label htmlFor="expectedPrice" className="block text-sm font-medium text-gray-700 mb-1">
                            Price After Discount (₦)
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₦</span>
                            <input
                                type="text"
                                id="expectedPrice"
                                name="expectedPrice"
                                value={expectedPrice || ''}
                                readOnly
                                className="w-full pl-8 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm sm:text-base"
                                placeholder="Calculated automatically"
                            />
                        </div>
                    </div>

                    {/* Stock Quantity */}
                    <div>
                        <label htmlFor="countInStock" className="block text-sm font-medium text-gray-700 mb-1">
                            Stock Quantity *
                        </label>
                        <input
                            type="number"
                            id="countInStock"
                            name="countInStock"
                            min="0"
                            value={formData.countInStock}
                            onChange={handleChange}
                            required={!formData.isCustom} // Not required for custom cakes
                            disabled={formData.isCustom} // Disabled for custom cakes
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base disabled:bg-gray-100"
                            placeholder="e.g. 5"
                        />
                    </div>

                    {/* Custom Cake Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isCustom"
                            name="isCustom"
                            checked={formData.isCustom}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isCustom" className="ml-2 block text-sm text-gray-900">
                            This is a custom order product
                        </label>
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        >
                            <option value="">Select a category</option>
                            {CAKE_CATEGORIES.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Size */}
                    <div>
                        <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                            Size/Portion
                        </label>
                        <input
                            type="text"
                            id="size"
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="e.g. 8-inch, Dozen, Single slice"
                        />
                    </div>

                    {/* Dietary Tags - Checkbox Group */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dietary Information
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {DIETARY_TAGS.map(tag => (
                                <label key={tag} className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        checked={formData.dietaryTags.includes(tag)}
                                        onChange={(e) => handleArrayChange('dietaryTags', tag, e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2">{tag}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Flavor Tags - Checkbox Group */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Flavor Profile
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {FLAVOR_TAGS.map(tag => (
                                <label key={tag} className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        checked={formData.flavorTags.includes(tag)}
                                        onChange={(e) => handleArrayChange('flavorTags', tag, e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2">{tag}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Image Upload - Multiple */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Images {!formData.isCustom && '*'}
                        </label>
                        
                        {/* Image Preview Grid */}
                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                                {formData.images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={image}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-20 object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index, image)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <label className="cursor-pointer inline-flex items-center bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Upload Images
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="sr-only"
                                multiple // Allow multiple selection
                                required={!formData.isCustom && formData.images.length === 0}
                            />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">Select multiple images</p>
                    </div>

                    {/* Ingredients - Dynamic List */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ingredients
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={ingredientInput}
                                onChange={(e) => setIngredientInput(e.target.value)}
                                placeholder="Add an ingredient"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                            />
                            <button
                                type="button"
                                onClick={addIngredient}
                                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                            >
                                Add
                            </button>
                        </div>
                        
                        {formData.ingredients.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-md">
                                <h4 className="text-xs font-medium text-gray-700 mb-1">Current Ingredients:</h4>
                                <ul className="space-y-1">
                                    {formData.ingredients.map((ingredient, index) => (
                                        <li key={index} className="flex items-center justify-between text-sm">
                                            <span>{ingredient}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeIngredient(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="col-span-1 md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="Describe the cake, its flavors, occasion suitability..."
                        />
                    </div>
                </div>

                <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-purplegradient hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </span>
                        ) : 'Update Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}
