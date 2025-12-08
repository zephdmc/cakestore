import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, updateProduct, formatProductForDisplay } from '../../services/productService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiUpload, 
  FiX, 
  FiPlus, 
  FiTag, 
  FiDollarSign, 
  FiPackage,
  FiEdit3,
  FiCoffee,
  FiHeart,
  FiSave,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
  FiDroplet,
  FiGrid,
  FiClock,
  FiRuler,
  FiLayers,
  FiShield,
  FiLock
} from 'react-icons/fi';

import { 
  PRODUCT_TYPES, 
  PRODUCT_TYPE_LABELS, 
  PRODUCT_CATEGORIES,
  PRODUCT_FIELD_CONFIGS 
} from '../../utils/productTypes';

// Default options for each product type
const DIETARY_TAGS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
  'Nut-Free', 'Egg-Free', 'Sugar-Free', 'Organic'
];

const FLAVOR_TAGS = [
  'Chocolate', 'Vanilla', 'Red Velvet', 'Fruit', 
  'Carrot', 'Lemon', 'Coffee', 'Cheesecake', 'Butterscotch'
];

const SCENT_TAGS = [
  'Lavender', 'Vanilla', 'Cinnamon', 'Citrus',
  'Sandalwood', 'Rose', 'Jasmine', 'Ocean Breeze',
  'Fresh Linen', 'Bergamot', 'Patchouli', 'Eucalyptus'
];

const WAX_TYPES = [
  'Soy Wax', 'Beeswax', 'Paraffin Wax', 'Coconut Wax',
  'Palm Wax', 'Rapeseed Wax', 'Gel Wax', 'Blended Wax'
];

const MATERIAL_OPTIONS = [
  'Ceramic', 'Glass', 'Porcelain', 'Stainless Steel',
  'Stoneware', 'Bamboo', 'Enamel', 'Plastic-Free'
];

const DESIGN_TYPES = [
  'Personalized Text', 'Photo Print', 'Digital Design',
  'Hand Painted', 'Vinyl Decal', 'Engraved', 'Glitter',
  'Color Changing', 'Seasonal Design'
];

export default function EditProductPage() {
  const { id } = useParams();
  const [productType, setProductType] = useState(PRODUCT_TYPES.CAKE);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    countInStock: '',
    images: [],
    productType: PRODUCT_TYPES.CAKE,
    discountPercentage: '',
    // Cake specific
    ingredients: [],
    dietaryTags: [],
    flavorTags: [],
    size: '',
    isCustom: false,
    // Candle specific
    scent: '',
    burnTime: '',
    waxType: '',
    dimensions: '',
    // Mug specific
    capacity: '',
    material: '',
    designType: '',
    isDishwasherSafe: false,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const navigate = useNavigate();

  // Get product type icon
  const getProductTypeIcon = (type) => {
    switch (type) {
      case PRODUCT_TYPES.CAKE: return FiCoffee;
      case PRODUCT_TYPES.CANDLE: return FiDroplet;
      case PRODUCT_TYPES.MUG: return FiGrid;
      default: return FiPackage;
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        const product = response.data;
        
        // Set product type
        setProductType(product.productType || PRODUCT_TYPES.CAKE);
        
        // Set all form data with proper defaults
        setFormData({
          name: product.name || '',
          price: product.price || '',
          description: product.description || '',
          category: product.category || '',
          countInStock: product.countInStock || '',
          images: product.images || [],
          productType: product.productType || PRODUCT_TYPES.CAKE,
          discountPercentage: product.discountPercentage || '',
          // Cake specific
          ingredients: product.ingredients || [],
          dietaryTags: product.dietaryTags || [],
          flavorTags: product.flavorTags || [],
          size: product.size || '',
          isCustom: product.isCustom || false,
          // Candle specific
          scent: product.scent || '',
          burnTime: product.burnTime || '',
          waxType: product.waxType || '',
          dimensions: product.dimensions || '',
          // Mug specific
          capacity: product.capacity || '',
          material: product.material || '',
          designType: product.designType || '',
          isDishwasherSafe: product.isDishwasherSafe || false,
        });
        
        // Calculate expected price
        if (product.discountPercentage && product.price) {
          const price = parseFloat(product.price) || 0;
          const discount = parseFloat(product.discountPercentage) || 0;
          const calculatedPrice = price - (price * (discount / 100));
          setExpectedPrice(calculatedPrice.toFixed(2));
        }
      } catch (err) {
        console.error('Error fetching product:', err);
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
      // Validate required fields based on product type
      const requiredFields = PRODUCT_FIELD_CONFIGS[productType].required;
      const missingFields = requiredFields.filter(field => !formData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      if (formData.images.length === 0) {
        throw new Error('Please upload at least one product image');
      }

      // Prepare update data
      const productToUpdate = {
        ...formData,
        price: parseFloat(formData.price),
        countInStock: parseInt(formData.countInStock),
        discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : 0,
      };

      const response = await updateProduct(id, productToUpdate);
      
      if (response.success) {
        setSuccess(response.message || `${PRODUCT_TYPE_LABELS[productType]} updated successfully!`);
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
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    
    setFormData(prev => {
      const updatedData = { ...prev, [name]: value };
      
      // Calculate expected price when price or discount changes
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

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()]
      }));
      setIngredientInput('');
    }
  };

  const removeIngredient = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      setUploadingImages(true);
      const newImageUrls = [];

      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files are allowed');
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('File size must be less than 5MB');
        }

        const filename = `products/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const storageRef = ref(storage, filename);
        
        const snapshot = await uploadBytes(storageRef, file, {
          contentType: file.type,
          customMetadata: {
            uploadedBy: auth.currentUser?.uid || 'admin',
            productType: productType
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
      setUploadingImages(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const renderTypeSpecificFields = () => {
    switch (productType) {
      case PRODUCT_TYPES.CAKE:
        return (
          <>
            {/* Size */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Size/Portion *
              </label>
              <div className="relative">
                <FiRuler className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 8-inch, Dozen, Single slice"
                />
              </div>
            </div>

            {/* Custom Product Toggle */}
            <div className="lg:col-span-2">
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="isCustom"
                  name="isCustom"
                  checked={formData.isCustom}
                  onChange={handleChange}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isCustom" className="ml-3 text-sm font-medium text-gray-900">
                  This is a custom order product (made-to-order)
                </label>
              </div>
            </div>

            {/* Dietary Tags */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Dietary Information
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DIETARY_TAGS.map(tag => (
                  <motion.label
                    key={tag}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-200 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.dietaryTags?.includes(tag)}
                      onChange={(e) => handleArrayChange('dietaryTags', tag, e.target.checked)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">{tag}</span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Flavor Tags */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Flavor Profile
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FLAVOR_TAGS.map(tag => (
                  <motion.label
                    key={tag}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-200 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.flavorTags?.includes(tag)}
                      onChange={(e) => handleArrayChange('flavorTags', tag, e.target.checked)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">{tag}</span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Ingredients *
              </label>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  placeholder="Add an ingredient (press Enter or click Add)"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={addIngredient}
                  className="bg-purple-600 text-white py-3 px-6 rounded-xl hover:bg-purple-700 transition-all duration-200 font-semibold"
                >
                  <FiPlus className="inline mr-2" />
                  Add
                </motion.button>
              </div>
              
              {formData.ingredients?.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Ingredients List:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.ingredients.map((ingredient, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white text-gray-700 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 flex items-center"
                      >
                        {ingredient}
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        );

      case PRODUCT_TYPES.CANDLE:
        return (
          <>
            {/* Scent */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Scent/Fragrance *
              </label>
              <div className="relative">
                <FiDroplet className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="scent"
                  value={formData.scent}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
                >
                  <option value="">Select a scent</option>
                  {SCENT_TAGS.map(scent => (
                    <option key={scent} value={scent}>{scent}</option>
                  ))}
                  <option value="custom">Custom Scent</option>
                </select>
              </div>
            </div>

            {/* Burn Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Burn Time *
              </label>
              <div className="relative">
                <FiClock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="burnTime"
                  value={formData.burnTime}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 40 hours, 60 hours"
                />
              </div>
            </div>

            {/* Wax Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Wax Type *
              </label>
              <div className="relative">
                <FiDroplet className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="waxType"
                  value={formData.waxType}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
                >
                  <option value="">Select wax type</option>
                  {WAX_TYPES.map(wax => (
                    <option key={wax} value={wax}>{wax}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Dimensions
              </label>
              <div className="relative">
                <FiRuler className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 3x3 inches, Height: 4 inches"
                />
              </div>
            </div>
          </>
        );

      case PRODUCT_TYPES.MUG:
        return (
          <>
            {/* Capacity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Capacity *
              </label>
              <div className="relative">
                <FiCoffee className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 350ml, 16oz, 500ml"
                />
              </div>
            </div>

            {/* Material */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Material *
              </label>
              <div className="relative">
                <FiLayers className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
                >
                  <option value="">Select material</option>
                  {MATERIAL_OPTIONS.map(material => (
                    <option key={material} value={material}>{material}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Design Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Design Type *
              </label>
              <div className="relative">
                <FiGrid className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="designType"
                  value={formData.designType}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
                >
                  <option value="">Select design type</option>
                  {DESIGN_TYPES.map(design => (
                    <option key={design} value={design}>{design}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dishwasher Safe */}
            <div className="lg:col-span-2">
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="isDishwasherSafe"
                  name="isDishwasherSafe"
                  checked={formData.isDishwasherSafe}
                  onChange={handleChange}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isDishwasherSafe" className="ml-3 text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    <FiShield className="mr-2 text-green-500" />
                    Dishwasher Safe
                  </div>
                </label>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderCategorySelector = () => (
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
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
        >
          <option value="">Select a category</option>
          {PRODUCT_CATEGORIES[productType]?.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
          <option value="Other">Other</option>
        </select>
      </div>
    </div>
  );

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading product details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ProductTypeIcon = getProductTypeIcon(productType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/admin/products')}
              className="flex items-center text-purple-600 hover:text-purple-700 font-semibold mr-6 group transition-colors duration-200"
            >
              <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Products
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Edit {PRODUCT_TYPE_LABELS[productType]}
              </h1>
              <p className="text-gray-600">Update product details and inventory</p>
            </div>
          </div>
        </motion.div>

        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6 shadow-sm"
            >
              <div className="flex items-center">
                <FiAlertCircle className="text-red-500 text-xl mr-3" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-4 mb-6 shadow-sm"
            >
              <div className="flex items-center">
                <FiCheckCircle className="text-green-500 text-xl mr-3" />
                <p className="text-green-700 font-medium">{success}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Type Info (Read-only) */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 mr-4">
                <ProductTypeIcon className="text-2xl text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  {PRODUCT_TYPE_LABELS[productType]}
                </h3>
                <p className="text-sm text-gray-600">
                  Product type cannot be changed after creation
                </p>
              </div>
            </div>
            <div className="flex items-center text-gray-500">
              <FiLock className="mr-2" />
              <span className="text-sm">Type Fixed</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiEdit3 className="mr-3 text-purple-500" />
                Basic Information
              </h2>
            </div>

            {/* Product Name */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter product name"
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
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="countInStock"
                min="0"
                value={formData.countInStock}
                onChange={handleChange}
                required={productType !== PRODUCT_TYPES.CAKE || !formData.isCustom}
                disabled={productType === PRODUCT_TYPES.CAKE && formData.isCustom}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 transition-all duration-200"
                placeholder="e.g., 50"
              />
            </div>

            {/* Category */}
            {renderCategorySelector()}

            {/* Product Type Specific Fields */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <ProductTypeIcon className="mr-3 text-purple-500" />
                {PRODUCT_TYPE_LABELS[productType]} Details
              </h2>
            </div>

            {renderTypeSpecificFields()}

            {/* Image Upload */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Product Images *
              </label>
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {formData.images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl border-2 border-gray-200 group-hover:border-purple-300 transition-all duration-200"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                      >
                        <FiX size={14} />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}

              <label className="cursor-pointer inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                {uploadingImages ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload className="mr-3" />
                    Upload More Images
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                      multiple
                      required={formData.images.length === 0}
                      disabled={uploadingImages}
                    />
                  </>
                )}
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Select multiple images to upload (Max 5MB per image)
              </p>
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
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Enter product description"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-8 border-t border-gray-200"
          >
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || uploadingImages}
              className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Updating {PRODUCT_TYPE_LABELS[productType]}...
                </>
              ) : (
                <>
                  <FiSave className="mr-3" />
                  Update {PRODUCT_TYPE_LABELS[productType]}
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}
