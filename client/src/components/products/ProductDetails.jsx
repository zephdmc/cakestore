import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProductById, formatProductForDisplay } from '../../services/productServic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiShoppingCart, 
  FiStar, 
  FiHeart, 
  FiShare2, 
  FiPackage,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiTag,
  FiCoffee,
  FiUsers,
  FiDroplet,
  FiGrid,
  FiLayers,
  FiShield,
  FiCheck,
  FiAlertCircle,
  FiTruck,
  FiRefreshCw
} from 'react-icons/fi';

import { 
  PRODUCT_TYPES, 
  PRODUCT_TYPE_LABELS, 
  PRODUCT_TYPE_COLORS 
} from '../../utils/productTypes';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        const formattedProduct = formatProductForDisplay(response.data);
        setProduct(formattedProduct);
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Get product type color
  const getProductTypeColor = (type) => {
    return PRODUCT_TYPE_COLORS[type] || PRODUCT_TYPE_COLORS[PRODUCT_TYPES.CAKE];
  };

  // Get product type icon
  const getProductTypeIcon = (type) => {
    switch (type) {
      case PRODUCT_TYPES.CAKE: return FiCoffee;
      case PRODUCT_TYPES.CANDLE: return FiDroplet;
      case PRODUCT_TYPES.MUG: return FiGrid;
      default: return FiPackage;
    }
  };

  const handleAddToCart = async () => {
    if (!product.inStock && !product.isCustom) {
      alert('This product is out of stock');
      return;
    }

    setIsAddingToCart(true);
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.displayPrice.discounted,
      originalPrice: product.displayPrice.original,
      discountPercentage: product.discountPercentage || 0,
      image: product.images[0],
      productType: product.productType,
      quantity: product.isCustom ? 1 : quantity, // Custom items usually quantity 1
      size: product.size || '',
      customNote: product.isCustom ? 'Custom order - contact for details' : ''
    };

    addToCart(cartItem);
    
    // Show success animation
    setTimeout(() => setIsAddingToCart(false), 1500);
  };

  const navigateImage = (direction) => {
    if (!product.images) return;
    
    if (direction === 'next') {
      setSelectedImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setSelectedImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    // You can add API call here to save to favorites
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const renderTypeSpecificDetails = () => {
    const colors = getProductTypeColor(product.productType);
    
    switch (product.productType) {
      case PRODUCT_TYPES.CAKE:
        return (
          <>
            {/* Size */}
            {product.size && (
              <div className={`${colors.light} rounded-2xl p-6 border ${colors.text.replace('text', 'border')}`}>
                <div className="flex items-center mb-3">
                  <FiTag className={`mr-3 ${colors.text}`} size={24} />
                  <h3 className="text-xl font-semibold text-gray-900">Size & Portion</h3>
                </div>
                <p className="text-lg font-bold text-gray-800">{product.size}</p>
              </div>
            )}

            {/* Dietary Information */}
            {product.dietaryTags && product.dietaryTags.length > 0 && (
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center mb-3">
                  <FiCheck className="mr-3 text-green-600" size={24} />
                  <h3 className="text-xl font-semibold text-gray-900">Dietary Information</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.dietaryTags.map((tag, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white text-green-800 px-4 py-2 rounded-xl font-semibold border border-green-300 shadow-sm"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* Flavor Profile */}
            {product.flavorTags && product.flavorTags.length > 0 && (
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center mb-3">
                  <FiStar className="mr-3 text-purple-600" size={24} />
                  <h3 className="text-xl font-semibold text-gray-900">Flavor Profile</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.flavorTags.map((tag, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white text-purple-800 px-4 py-2 rounded-xl font-semibold border border-purple-300 shadow-sm"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                <div className="flex items-center mb-3">
                  <FiCoffee className="mr-3 text-amber-600" size={24} />
                  <h3 className="text-xl font-semibold text-gray-900">Ingredients</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.ingredients.map((ingredient, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center bg-white rounded-xl p-3 border border-amber-200"
                    >
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                      <span className="text-gray-800 font-medium">{ingredient}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        );

      case PRODUCT_TYPES.CANDLE:
        return (
          <>
            {/* Candle Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Scent */}
              {product.scent && (
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                  <div className="flex items-center mb-3">
                    <FiDroplet className="mr-3 text-amber-600" size={24} />
                    <h3 className="text-xl font-semibold text-gray-900">Scent</h3>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{product.scent}</p>
                </div>
              )}

              {/* Burn Time */}
              {product.burnTime && (
                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                  <div className="flex items-center mb-3">
                    <FiClock className="mr-3 text-orange-600" size={24} />
                    <h3 className="text-xl font-semibold text-gray-900">Burn Time</h3>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{product.burnTime}</p>
                </div>
              )}

              {/* Wax Type */}
              {product.waxType && (
                <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                  <div className="flex items-center mb-3">
                    <FiDroplet className="mr-3 text-yellow-600" size={24} />
                    <h3 className="text-xl font-semibold text-gray-900">Wax Type</h3>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{product.waxType}</p>
                </div>
              )}

              {/* Dimensions */}
              {product.dimensions && (
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                  <div className="flex items-center mb-3">
                    <FiTag className="mr-3 text-amber-600" size={24} />
                    <h3 className="text-xl font-semibold text-gray-900">Dimensions</h3>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{product.dimensions}</p>
                </div>
              )}
            </div>
          </>
        );

      case PRODUCT_TYPES.MUG:
        return (
          <>
            {/* Mug Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Capacity */}
              {product.capacity && (
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center mb-3">
                    <FiCoffee className="mr-3 text-blue-600" size={24} />
                    <h3 className="text-xl font-semibold text-gray-900">Capacity</h3>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{product.capacity}</p>
                </div>
              )}

              {/* Material */}
              {product.material && (
                <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200">
                  <div className="flex items-center mb-3">
                    <FiLayers className="mr-3 text-cyan-600" size={24} />
                    <h3 className="text-xl font-semibold text-gray-900">Material</h3>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{product.material}</p>
                </div>
              )}

              {/* Design Type */}
              {product.designType && (
                <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200">
                  <div className="flex items-center mb-3">
                    <FiGrid className="mr-3 text-indigo-600" size={24} />
                    <h3 className="text-xl font-semibold text-gray-900">Design Type</h3>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{product.designType}</p>
                </div>
              )}

              {/* Dishwasher Safe */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center mb-3">
                  <FiShield className="mr-3 text-green-600" size={24} />
                  <h3 className="text-xl font-semibold text-gray-900">Care Instructions</h3>
                </div>
                <div className="flex items-center">
                  <span className={`text-lg font-bold ${product.isDishwasherSafe ? 'text-green-700' : 'text-amber-700'}`}>
                    {product.isDishwasherSafe ? 'Dishwasher Safe' : 'Hand Wash Recommended'}
                  </span>
                  {product.isDishwasherSafe && <FiCheck className="ml-2 text-green-600" />}
                </div>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (loading) {
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
  
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h3>
            <p className="text-gray-600 mb-6">{error || 'The product you\'re looking for is no longer available.'}</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
            >
              Browse Products
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Get product type info
  const ProductTypeIcon = getProductTypeIcon(product.productType);
  const productTypeColors = getProductTypeColor(product.productType);
  
  // Get current display image
  const displayImage = product.images && product.images.length > 0 
    ? product.images[selectedImageIndex] 
    : '/placeholder-product.png';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200 group"
            >
              <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Products
            </button>
            
            {/* Product Type Badge */}
            <div className={`${productTypeColors.light} px-4 py-2 rounded-full flex items-center`}>
              <ProductTypeIcon className={`mr-2 ${productTypeColors.text}`} />
              <span className={`font-semibold ${productTypeColors.text}`}>
                {PRODUCT_TYPE_LABELS[product.productType]}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden relative"
          >
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 space-y-2">
              {/* Discount Badge */}
              {product.displayPrice.discountPercentage > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg transform -rotate-6"
                >
                  {product.displayPrice.discountPercentage}% OFF
                </motion.span>
              )}
              
              {/* Custom Badge */}
              {product.isCustom && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg block"
                >
                  Custom Order
                </motion.span>
              )}
              
              {/* Stock Status Badge */}
              {!product.inStock && !product.isCustom && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg block"
                >
                  Out of Stock
                </motion.span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleLike}
                className={`p-3 rounded-full shadow-lg ${isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}
              >
                <FiHeart className="text-lg" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={shareProduct}
                className="p-3 rounded-full bg-white text-gray-700 shadow-lg"
              >
                <FiShare2 className="text-lg" />
              </motion.button>
            </div>

            {/* Main Image */}
            <div className="relative aspect-square bg-gray-50">
              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={displayImage}
                alt={product.name}
                className="w-full h-full object-contain cursor-zoom-in p-8"
                onClick={() => setIsImageZoomed(true)}
                onError={(e) => {
                  e.target.src = '/placeholder-product.png';
                }}
              />
              
              {/* Image Navigation */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200"
                  >
                    <FiChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200"
                  >
                    <FiChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-3 overflow-x-auto py-2">
                  {product.images.map((image, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                        selectedImageIndex === index 
                          ? 'border-purple-500 shadow-md' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="space-y-6">
                {/* Product Name and Category */}
                <div>
                  <div className="flex items-center mb-2">
                    <FiTag className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500 uppercase font-semibold">
                      {product.category || 'Uncategorized'}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    {product.name}
                  </h1>
                </div>

                {/* Price Section */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      {product.displayPrice.discountPercentage > 0 ? (
                        <>
                          <div className="flex items-center gap-4 mb-2">
                            <span className="text-3xl font-bold text-purple-600">
                              ₦{product.displayPrice.discounted}
                            </span>
                            <span className="text-xl text-gray-500 line-through">
                              ₦{product.displayPrice.original}
                            </span>
                          </div>
                          <p className="text-sm text-green-600 font-semibold">
                            You save ₦{(parseFloat(product.displayPrice.original) - parseFloat(product.displayPrice.discounted)).toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-purple-600">
                          ₦{product.displayPrice.original}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    {!product.isCustom && (
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          product.inStock ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className={product.inStock ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                          {product.inStock ? `${product.countInStock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 flex items-center">
                    <FiPackage className="mr-2 text-purple-500" />
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                </div>
              </div>
            </div>

            {/* Type Specific Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {renderTypeSpecificDetails()}
            </motion.div>

            {/* Add to Cart Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
            >
              <div className="space-y-6">
                {/* Quantity Selector (only for non-custom products) */}
                {!product.isCustom && product.inStock && (
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-3 font-semibold text-lg">Quantity</label>
                    <div className="flex items-center">
                      <select
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="border-2 border-gray-300 rounded-xl p-4 w-32 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 font-semibold text-lg"
                      >
                        {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                      <span className="ml-4 text-gray-600">
                        Maximum: {product.countInStock}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={(!product.inStock && !product.isCustom) || isAddingToCart}
                    className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center transition-all duration-200 ${
                      (!product.inStock && !product.isCustom) 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                    }`}
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <FiShoppingCart className="mr-3 text-xl" />
                        {product.isCustom 
                          ? 'Start Custom Order' 
                          : product.inStock 
                            ? 'Add to Cart' 
                            : 'Notify When Available'
                        }
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                  <div className="flex items-center text-gray-600">
                    <FiTruck className="mr-3 text-purple-500" />
                    <div>
                      <p className="font-semibold">Free Shipping</p>
                      <p className="text-sm">On orders over ₦50,000</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiRefreshCw className="mr-3 text-purple-500" />
                    <div>
                      <p className="font-semibold">Easy Returns</p>
                      <p className="text-sm">30-day return policy</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {isImageZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsImageZoomed(false)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={displayImage}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setIsImageZoomed(false)}
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all duration-200"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
