import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { 
  FiShoppingCart, 
  FiHeart, 
  FiEye, 
  FiCoffee,
  FiDroplet,
  FiGrid,
  FiTag,
  FiStar,
  FiClock,
  FiRuler,
  FiLayers,
  FiShield
} from 'react-icons/fi';
import { PRODUCT_TYPES, PRODUCT_TYPE_LABELS } from '../../utils/productTypes';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Get product type icon
  const getProductTypeIcon = (type) => {
    switch (type) {
      case PRODUCT_TYPES.CAKE: return FiCoffee;
      case PRODUCT_TYPES.CANDLE: return FiDroplet;
      case PRODUCT_TYPES.MUG: return FiGrid;
      default: return FiCoffee;
    }
  };

  // Get product type color
  const getProductTypeColor = (type) => {
    switch (type) {
      case PRODUCT_TYPES.CAKE: return 'bg-gradient-to-r from-pink-500 to-rose-500';
      case PRODUCT_TYPES.CANDLE: return 'bg-gradient-to-r from-amber-500 to-orange-500';
      case PRODUCT_TYPES.MUG: return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default: return 'bg-gradient-to-r from-purple-500 to-pink-500';
    }
  };

  // Calculate price with discount
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const originalPrice = product.price || 0;
  const discountedPrice = hasDiscount 
    ? originalPrice * (1 - product.discountPercentage / 100)
    : originalPrice;

  // Get the first image for the card display
  const displayImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/placeholder-product.png';

  // Check if product is in stock
  const isInStock = product.countInStock > 0;
  
  // Check if product is custom (for cakes)
  const isCustom = product.isCustom || false;

  // Get type-specific details for quick view
  const getTypeSpecificDetails = () => {
    switch (product.productType) {
      case PRODUCT_TYPES.CAKE:
        return {
          icon: FiCoffee,
          details: [
            { label: 'Size', value: product.size },
            { label: 'Custom', value: isCustom ? 'Yes' : 'No' }
          ]
        };
      case PRODUCT_TYPES.CANDLE:
        return {
          icon: FiDroplet,
          details: [
            { label: 'Scent', value: product.scent },
            { label: 'Burn Time', value: product.burnTime }
          ]
        };
      case PRODUCT_TYPES.MUG:
        return {
          icon: FiGrid,
          details: [
            { label: 'Capacity', value: product.capacity },
            { label: 'Material', value: product.material }
          ]
        };
      default:
        return { icon: FiCoffee, details: [] };
    }
  };

  const typeDetails = getTypeSpecificDetails();
  const ProductTypeIcon = getProductTypeIcon(product.productType);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isInStock) {
      alert('This product is out of stock');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: discountedPrice,
      originalPrice: originalPrice,
      discountPercentage: product.discountPercentage || 0,
      image: displayImage,
      productType: product.productType,
      size: product.size,
      quantity: 1
    });
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // You can implement a quick view modal here
    console.log('Quick view for:', product.id);
  };

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <Link to={`/products/${product.id}`}>
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
          {/* Image Container */}
          <div className="relative overflow-hidden bg-gray-100">
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.target.src = '/placeholder-product.png';
              }}
            />

            {/* Badges Container */}
            <div className="absolute top-3 left-3 space-y-2">
              {/* Product Type Badge */}
              <motion.span
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: -12 }}
                className={`${getProductTypeColor(product.productType)} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg block`}
              >
                {PRODUCT_TYPE_LABELS[product.productType]?.split(' ')[0] || 'Product'}
              </motion.span>

              {/* Discount Badge */}
              {hasDiscount && (
                <motion.span
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: -12 }}
                  transition={{ delay: 0.05 }}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg block"
                >
                  {product.discountPercentage}% OFF
                </motion.span>
              )}

              {/* Stock Status Badge */}
              {!isInStock && (
                <motion.span
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: -12 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg block"
                >
                  Out of Stock
                </motion.span>
              )}

              {/* Custom Badge (for cakes) */}
              {isCustom && (
                <motion.span
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: -12 }}
                  transition={{ delay: 0.15 }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg block"
                >
                  Custom Order
                </motion.span>
              )}
            </div>

            {/* Action Buttons Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end justify-center p-4 transition-opacity duration-300"
            >
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className={`p-3 rounded-full ${isInStock ? 'bg-white text-purple-600 hover:bg-purple-50' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} transition-colors duration-200 shadow-lg`}
                >
                  <FiShoppingCart className="text-lg" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleQuickView}
                  className="p-3 rounded-full bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-lg"
                >
                  <FiEye className="text-lg" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleLike}
                  className={`p-3 rounded-full ${isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} transition-colors duration-200 shadow-lg`}
                >
                  <FiHeart className="text-lg" />
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Info Overlay */}
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: isHovered ? 0 : 100 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ProductTypeIcon />
                  <span className="text-sm font-medium">
                    {typeDetails.details[0]?.value || 'View Details'}
                  </span>
                </div>
                <span className="text-sm opacity-90">
                  Click to view
                </span>
              </div>
            </motion.div>
          </div>

          {/* Product Details */}
          <div className="p-5">
            {/* Product Type and Category */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className={`${getProductTypeColor(product.productType)} p-2 rounded-lg mr-2`}>
                  <ProductTypeIcon className="text-white text-sm" />
                </div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {product.category || 'Uncategorized'}
                </span>
              </div>
              
              {/* Rating (placeholder) */}
              <div className="flex items-center">
                <FiStar className="text-amber-400 text-sm mr-1" />
                <span className="text-xs text-gray-500">4.5</span>
              </div>
            </div>

            {/* Product Name */}
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
              {product.name}
            </h3>

            {/* Short Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {product.description || 'No description available'}
            </p>

            {/* Type-specific Quick Details */}
            {typeDetails.details.length > 0 && (
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-2">
                  {typeDetails.details.map((detail, index) => (
                    detail.value && (
                      <div key={index} className="flex items-center text-xs text-gray-600">
                        {index === 0 && detail.label === 'Size' && <FiRuler className="mr-1" />}
                        {index === 0 && detail.label === 'Scent' && <FiDroplet className="mr-1" />}
                        {index === 0 && detail.label === 'Capacity' && <FiCoffee className="mr-1" />}
                        {detail.label === 'Burn Time' && <FiClock className="mr-1" />}
                        {detail.label === 'Custom' && <FiLayers className="mr-1" />}
                        {detail.label === 'Material' && <FiShield className="mr-1" />}
                        <span className="font-medium">{detail.label}: </span>
                        <span className="ml-1 truncate">{detail.value}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Price and Add to Cart Button */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
              {/* Price Display */}
              <div className="flex flex-col">
                {hasDiscount ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-purple-600">
                        ₦{discountedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₦{originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-green-600 font-semibold">
                      Save ₦{(originalPrice - discountedPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-purple-600">
                    ₦{originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Add to Cart Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center ${
                  isInStock 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FiShoppingCart className="mr-2" />
                {isInStock ? 'Add to Cart' : 'Out of Stock'}
              </motion.button>
            </div>

            {/* Stock Indicator */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Availability:</span>
                <span className={`font-semibold ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
                  {isInStock ? `${product.countInStock} in stock` : 'Out of stock'}
                </span>
              </div>
              {isInStock && product.countInStock < 10 && (
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full" 
                    style={{ width: `${(product.countInStock / 10) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
