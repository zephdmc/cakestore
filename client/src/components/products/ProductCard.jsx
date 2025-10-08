import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';
import { 
    FiShoppingCart, 
    FiStar, 
    FiTag, 
    FiPackage,
    FiHeart,
    FiCoffee
} from 'react-icons/fi';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    
    // Calculate prices using the same logic as featured products section
    const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
    
    // Original price calculation (same as featured section)
    const originalPrice = hasDiscount 
        ? product.price + (product.price * (product.discountPercentage / 100))
        : product.price;
    
    // Final price is just product.price when there's a discount
    const displayPrice = product.price;

    // Get the first image for the card display
    const displayImage = product.images && product.images.length > 0 
        ? product.images[0] 
        : '/placeholder-product.png';

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 relative group"
        >
            {/* Image Container */}
            <div className="relative overflow-hidden">
                <Link to={`/products/${product.id}`}>
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        src={displayImage}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                            e.target.src = '/placeholder-product.png';
                        }}
                    />
                </Link>

                {/* Badges Container */}
                <div className="absolute top-3 left-3 space-y-2">
                    {/* Discount Badge */}
                    {hasDiscount && (
                        <motion.span
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: -12 }}
                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg block"
                        >
                            {product.discountPercentage}% OFF
                        </motion.span>
                    )}

                    {/* Custom Product Badge */}
                    {product.isCustom && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg block"
                        >
                            Custom Order
                        </motion.span>
                    )}
                </div>

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleAddToCart}
                        disabled={!product.isCustom && product.countInStock === 0}
                        className={`bg-white text-purple-600 rounded-full p-3 shadow-lg ${
                            (!product.isCustom && product.countInStock === 0) 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-purple-600 hover:text-white'
                        } transition-all duration-200`}
                    >
                        <FiShoppingCart size={20} />
                    </motion.button>
                </div>
            </div>
            
            {/* Content Container */}
            <div className="p-5">
                {/* Product Name */}
                <Link to={`/products/${product.id}`}>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-purple-600 transition-colors duration-200 line-clamp-2 group-hover:underline">
                        {product.name}
                    </h3>
                </Link>

                {/* Size and Basic Info */}
                <div className="flex items-center text-sm text-gray-600 mb-3 space-x-4">
                    {product.size && (
                        <div className="flex items-center">
                            <FiPackage size={14} className="mr-1 text-purple-500" />
                            <span>{product.size}</span>
                        </div>
                    )}
                    
                    {/* Stock Status - Don't show for custom products */}
                    {!product.isCustom && (
                        <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-1 ${
                                product.countInStock > 0 ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            <span className={product.countInStock > 0 ? "text-green-600" : "text-red-600"}>
                                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Flavor Tags */}
                {product.flavorTags && product.flavorTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {product.flavorTags.slice(0, 2).map((tag, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium flex items-center"
                            >
                                <FiCoffee size={10} className="mr-1" />
                                {tag}
                            </motion.span>
                        ))}
                        {product.flavorTags.length > 2 && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                +{product.flavorTags.length - 2}
                            </span>
                        )}
                    </div>
                )}

                {/* Dietary Tags (if any) */}
                {product.dietaryTags && product.dietaryTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {product.dietaryTags.slice(0, 2).map((tag, index) => (
                            <span
                                key={index}
                                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex items-center"
                            >
                                <FiHeart size={10} className="mr-1" />
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Price and Action Section */}
                <div className="flex items-center justify-between mt-auto">
                    {/* Price Display */}
                    <div className="flex flex-col">
                        {hasDiscount ? (
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-purple-600">
                                    ₦{displayPrice.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                    ₦{originalPrice.toLocaleString()}
                                </span>
                            </div>
                        ) : (
                            <span className="text-lg font-bold text-purple-600">
                                ₦{product.price.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Add to Cart Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToCart}
                        disabled={!product.isCustom && product.countInStock === 0}
                        className={`flex items-center px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                            (!product.isCustom && product.countInStock === 0) 
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                        }`}
                    >
                        <FiShoppingCart className="mr-2" size={16} />
                        {product.isCustom ? 'Customize' : 
                         product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </motion.button>
                </div>

                {/* Rating (if available) */}
                {product.rating && (
                    <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center">
                            <FiStar className="text-yellow-400 mr-1" size={14} />
                            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">•</span>
                        <span className="text-xs text-gray-500 ml-2">Best Seller</span>
                    </div>
                )}
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-200 rounded-2xl pointer-events-none transition-all duration-300"></div>
        </motion.div>
    );
}
