import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../services/productService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../../firebase/config';
import { 
    FiArrowLeft, 
    FiUpload, 
    FiX, 
    FiPlus, 
    FiTag, 
    FiDollarSign, 
    FiPackage,
    FiCoffee,
    FiHeart,
    FiSave,
    FiTrash2,
    FiCheckCircle,
    FiAlertCircle,
    FiEdit3,
    FiThermometer,
    FiDroplet,
    FiHome
} from 'react-icons/fi';

const MUG_CATEGORIES = [
    'Ceramic Mugs',
    'Travel Mugs',
    'Custom Mugs',
    'Gift Mugs',
    'Limited Edition',
    'Seasonal Mugs',
    'Office Mugs',
    'Novelty Mugs'
];

const MUG_MATERIALS = [
    'Ceramic',
    'Porcelain',
    'Stoneware',
    'Glass',
    'Stainless Steel',
    'Bamboo',
    'Enamel',
    'Plastic'
];

const MUG_FEATURES = [
    'Microwave Safe',
    'Dishwasher Safe',
    'Insulated',
    'Leak Proof',
    'BPA Free',
    'Eco-Friendly',
    'Hand Wash Only',
    'Freezer Safe'
];

const DESIGN_TAGS = [
    'Minimalist',
    'Funny',
    'Vintage',
    'Modern',
    'Custom Design',
    'Inspirational',
    'Seasonal',
    'Corporate',
    'Personalized',
    'Artistic'
];

const HANDLE_TYPES = [
    'Standard Handle',
    'No Handle',
    'Travel Lid',
    'Double Wall',
    'Ergonomic',
    'Traditional'
];

export default function AddProductPage() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        countInStock: '',
        images: [],
        materials: [],
        features: [],
        capacity: '',
        designTags: [],
        discountPercentage: '',
        isCustom: false,
        handleType: '',
        isDishwasherSafe: false,
        isMicrowaveSafe: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [expectedPrice, setExpectedPrice] = useState('');
    const [materialInput, setMaterialInput] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (isNaN(formData.price) || isNaN(formData.countInStock)) {
                throw new Error('Price and stock must be valid numbers');
            }

            if (!auth.currentUser) {
                throw new Error('Please sign in first');
            }

            if (!formData.isCustom && formData.images.length === 0) {
                throw new Error('Please upload at least one product image');
            }

            const productToSubmit = {
                ...formData,
                price: parseFloat(formData.price),
                countInStock: parseInt(formData.countInStock),
                discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : 0,
            };

            const response = await createProduct(productToSubmit);
            if (response.success) {
                setSuccess('Mug created successfully! Redirecting...');
                setTimeout(() => navigate('/admin/products'), 1500);
            } else {
                throw new Error(response.message || 'Creation failed');
            }
        } catch (err) {
            setError(err.message.includes('Network')
                ? 'Network error - please check your connection'
                : err.message
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
            return;
        }
        
        setFormData(prev => {
            const updatedData = { ...prev, [name]: value };
            
            if (name === 'price' || name === 'discountPercentage') {
                const price = parseFloat(updatedData.price) || 0;
                const discount = parseFloat(updatedData.discountPercentage) || 0;
                const calculatedPrice = price - (price * (discount / 100));
                setExpectedPrice(calculatedPrice.toFixed(2));
            }
            
            return updatedData;
        });
    };

    const handleArrayChange = (field, value, isChecked) => {
        setFormData(prev => {
            const currentArray = prev[field] || [];
            let newArray;
            
            if (isChecked) {
                newArray = [...currentArray, value];
            } else {
                newArray = currentArray.filter(item => item !== value);
            }
            
            return { ...prev, [field]: newArray };
        });
    };

    const addMaterial = () => {
        if (materialInput.trim()) {
            setFormData(prev => ({
                ...prev,
                materials: [...prev.materials, materialInput.trim()]
            }));
            setMaterialInput('');
        }
    };

    const removeMaterial = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            materials: prev.materials.filter((_, index) => index !== indexToRemove)
        }));
    };

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

    const removeImage = async (indexToRemove, imageUrl) => {
        try {
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter((_, index) => index !== indexToRemove)
            }));
        } catch (err) {
            console.error("Error removing image:", err);
            setError('Error removing image');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-blue-600 hover:text-blue-700 font-semibold mr-6 group transition-colors duration-200"
                        >
                            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Products
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Mug Product</h1>
                            <p className="text-gray-600">Create a new mug for your collection</p>
                        </div>
                    </div>
                </div>

                {/* Status Messages */}
                <div>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6 shadow-sm">
                            <div className="flex items-center">
                                <FiAlertCircle className="text-red-500 text-xl mr-3" />
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-4 mb-6 shadow-sm">
                            <div className="flex items-center">
                                <FiCheckCircle className="text-green-500 text-xl mr-3" />
                                <p className="text-green-700 font-medium">{success}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-xl p-8"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Basic Information */}
                        <div className="lg:col-span-2">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <FiEdit3 className="mr-3 text-blue-500" />
                                Basic Information
                            </h2>
                        </div>

                        {/* Product Name */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Mug Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="e.g. Classic Ceramic Coffee Mug"
                            />
                        </div>

                        {/* Price Section */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Price (₦) *
                            </label>
                            <div className="relative">
                                <FiDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    name="price"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Discount Percentage */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Discount Percentage (%)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                                <input
                                    type="number"
                                    name="discountPercentage"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={formData.discountPercentage}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Expected Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Price After Discount (₦)
                            </label>
                            <div className="relative">
                                <FiDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={expectedPrice || ''}
                                    readOnly
                                    className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600"
                                    placeholder="Calculated automatically"
                                />
                            </div>
                        </div>

                        {/* Capacity */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Capacity (oz) *
                            </label>
                            <div className="relative">
                                <FiDroplet className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="e.g. 11oz, 15oz, 20oz"
                                />
                            </div>
                        </div>

                        {/* Stock Quantity */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Stock Quantity {!formData.isCustom && '*'}
                            </label>
                            <input
                                type="number"
                                name="countInStock"
                                min="0"
                                value={formData.countInStock}
                                onChange={handleChange}
                                required={!formData.isCustom}
                                disabled={formData.isCustom}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all duration-200"
                                placeholder="e.g. 50"
                            />
                        </div>

                        {/* Handle Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Handle Type
                            </label>
                            <div className="relative">
                                <FiPackage className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    name="handleType"
                                    value={formData.handleType}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
                                >
                                    <option value="">Select handle type</option>
                                    {HANDLE_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Safety Features */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Safety Features
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isDishwasherSafe"
                                        checked={formData.isDishwasherSafe}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <FiHome className="ml-3 text-blue-500 mr-2" />
                                    <span className="text-sm font-medium text-gray-700">Dishwasher Safe</span>
                                </label>
                                <label className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isMicrowaveSafe"
                                        checked={formData.isMicrowaveSafe}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <FiThermometer className="ml-3 text-blue-500 mr-2" />
                                    <span className="text-sm font-medium text-gray-700">Microwave Safe</span>
                                </label>
                            </div>
                        </div>

                        {/* Custom Product Toggle */}
                        <div className="flex items-center lg:col-span-2">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isCustom"
                                    name="isCustom"
                                    checked={formData.isCustom}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isCustom" className="ml-3 text-sm font-medium text-gray-900">
                                    This is a custom designed mug
                                </label>
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Category *
                            </label>
                            <div className="relative">
                                <FiTag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
                                >
                                    <option value="">Select a category</option>
                                    {MUG_CATEGORIES.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Materials */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                <FiPackage className="mr-2 text-blue-500" />
                                Materials
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                {MUG_MATERIALS.map(material => (
                                    <label
                                        key={material}
                                        className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.materials.includes(material)}
                                            onChange={(e) => handleArrayChange('materials', material, e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-3 text-sm font-medium text-gray-700">{material}</span>
                                    </label>
                                ))}
                            </div>
                            
                            {/* Additional Materials Input */}
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={materialInput}
                                    onChange={(e) => setMaterialInput(e.target.value)}
                                    placeholder="Add custom material"
                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
                                />
                                <button
                                    type="button"
                                    onClick={addMaterial}
                                    className="bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold"
                                >
                                    <FiPlus className="inline mr-2" />
                                    Add
                                </button>
                            </div>
                            
                            {formData.materials.length > 0 && (
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mt-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Selected Materials:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.materials.map((material, index) => (
                                            <span
                                                key={index}
                                                className="bg-white text-gray-700 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 flex items-center"
                                            >
                                                {material}
                                                <button
                                                    type="button"
                                                    onClick={() => removeMaterial(index)}
                                                    className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Features */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                <FiHeart className="mr-2 text-blue-500" />
                                Features & Specifications
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {MUG_FEATURES.map(feature => (
                                    <label
                                        key={feature}
                                        className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.features.includes(feature)}
                                            onChange={(e) => handleArrayChange('features', feature, e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-3 text-sm font-medium text-gray-700">{feature}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Design Tags */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                <FiCoffee className="mr-2 text-blue-500" />
                                Design Style
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {DESIGN_TAGS.map(tag => (
                                    <label
                                        key={tag}
                                        className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.designTags.includes(tag)}
                                            onChange={(e) => handleArrayChange('designTags', tag, e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-3 text-sm font-medium text-gray-700">{tag}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Product Images {!formData.isCustom && '*'}
                            </label>
                            
                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {formData.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className="relative group"
                                        >
                                            <img
                                                src={image}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-xl border-2 border-gray-200 group-hover:border-blue-300 transition-all duration-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index, image)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                                            >
                                                <FiX size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <label className="cursor-pointer inline-flex items-center bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold">
                                <FiUpload className="mr-3" />
                                Upload Images
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="sr-only"
                                    multiple
                                    required={!formData.isCustom && formData.images.length === 0}
                                />
                            </label>
                            <p className="text-sm text-gray-500 mt-2">Select multiple images to upload</p>
                        </div>

                        {/* Description */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                rows={5}
                                value={formData.description}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                placeholder="Describe the mug, its features, design, perfect usage scenarios, care instructions..."
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-8 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Creating Mug...
                                </>
                            ) : (
                                <>
                                    <FiSave className="mr-3" />
                                    Create Mug
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
