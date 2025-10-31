import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProductById } from '../../services/productService';
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
    FiThermometer,
    FiHome,
    FiDroplet,
    FiCheck
} from 'react-icons/fi';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isImageZoomed, setIsImageZoomed] = useState(false);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id);
                setProduct(response.data);
            } catch (err) {
                setError(err.message || 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        // Show success notification here if needed
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Loading mug details...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiPackage className="text-red-500 text-2xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Mug Not Found</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                        >
                            Browse Mugs
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiCoffee className="text-gray-500 text-2xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Mug Not Available</h3>
                        <p className="text-gray-600 mb-6">The mug you're looking for is no longer available.</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                        >
                            Browse Mugs
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Calculate discounted price
    const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
    const discountedPrice = hasDiscount 
        ? product.price - (product.price * (product.discountPercentage / 100))
        : product.price;

    // Get current display image
    const displayImage = product.images && product.images.length > 0 
        ? product.images[selectedImageIndex] 
        : '/placeholder-mug.png';

    // Check if product can be added to cart
    const canAddToCart = product.isCustom || product.countInStock > 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Breadcrumb Navigation */}
                <motion.nav
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 group"
                    >
                        <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Mugs
                    </button>
                </motion.nav>

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
                            {hasDiscount && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg transform -rotate-6"
                                >
                                    {product.discountPercentage}% OFF
                                </motion.span>
                            )}
                            
                            {product.isCustom && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg block"
                                >
                                    Custom Design
                                </motion.span>
                            )}
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
                                    e.target.src = '/placeholder-mug.png';
                                }}
                            />
                            
                            {/* Image Navigation */}
                            {product.images && product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => navigateImage('prev')}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200"
                                    >
                                        <FiChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => navigateImage('next')}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200"
                                    >
                                        <FiChevronRight size={20} />
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
                                            className={`flex-shrink-0 w-16 h-16 border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                                                selectedImageIndex === index 
                                                    ? 'border-blue-500 shadow-md' 
                                                    : 'border-gray-200 hover:border-blue-300'
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
                        className="bg-white rounded-2xl shadow-xl p-8"
                    >
                        <div className="space-y-6">
                            {/* Header */}
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                                    {product.name}
                                </h1>
                                
                                {/* Capacity and Handle Type */}
                                <div className="flex items-center gap-4 text-gray-600 mb-4">
                                    {product.capacity && (
                                        <div className="flex items-center">
                                            <FiDroplet className="mr-2 text-blue-500" />
                                            <span className="font-medium">{product.capacity}</span>
                                        </div>
                                    )}
                                    {product.handleType && (
                                        <div className="flex items-center">
                                            <FiPackage className="mr-2 text-blue-500" />
                                            <span className="font-medium">{product.handleType}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-100">
                                <div className="flex items-center gap-4 mb-3">
                                    {hasDiscount ? (
                                        <>
                                            <span className="text-3xl font-bold text-blue-600">
                                                ₦{discountedPrice.toLocaleString()}
                                            </span>
                                            <span className="text-xl text-gray-500 line-through">
                                                ₦{product.price.toLocaleString()}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-3xl font-bold text-blue-600">
                                            ₦{product.price.toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                {/* Stock Status */}
                                {!product.isCustom && (
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-2 ${
                                            product.countInStock > 0 ? 'bg-green-500' : 'bg-red-500'
                                        }`}></div>
                                        <span className={product.countInStock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                            {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Safety Features */}
                            {(product.isMicrowaveSafe || product.isDishwasherSafe) && (
                                <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                                        <FiCheck className="mr-2 text-green-500" />
                                        Safety Features
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {product.isMicrowaveSafe && (
                                            <div className="flex items-center text-green-700">
                                                <FiThermometer className="mr-2 text-green-500" />
                                                <span className="font-medium">Microwave Safe</span>
                                            </div>
                                        )}
                                        {product.isDishwasherSafe && (
                                            <div className="flex items-center text-blue-700">
                                                <FiHome className="mr-2 text-blue-500" />
                                                <span className="font-medium">Dishwasher Safe</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 flex items-center">
                                    <FiPackage className="mr-2 text-blue-500" />
                                    Description
                                </h3>
                                <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                            </div>

                            {/* Materials */}
                            {product.materials && product.materials.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 flex items-center">
                                        <FiPackage className="mr-2 text-blue-500" />
                                        Materials
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.materials.map((material, index) => (
                                            <motion.span
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-blue-100 text-blue-800 px-3 py-2 rounded-xl text-sm font-semibold"
                                            >
                                                {material}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Features */}
                            {product.features && product.features.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 flex items-center">
                                        <FiStar className="mr-2 text-blue-500" />
                                        Features
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {product.features.map((feature, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center text-teal-700"
                                            >
                                                <FiCheck className="mr-2 text-teal-500" />
                                                <span className="font-medium">{feature}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Design Style */}
                            {product.designTags && product.designTags.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 flex items-center">
                                        <FiTag className="mr-2 text-blue-500" />
                                        Design Style
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.designTags.map((tag, index) => (
                                            <motion.span
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-purple-100 text-purple-800 px-3 py-2 rounded-xl text-sm font-semibold"
                                            >
                                                {tag}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart Section */}
                            {canAddToCart && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
                                >
                                    {!product.isCustom && (
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-3 font-semibold text-lg">Quantity</label>
                                            <select
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                                className="border-2 border-gray-300 rounded-xl p-3 w-24 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-semibold"
                                            >
                                                {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleAddToCart}
                                        className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold text-lg flex items-center justify-center"
                                    >
                                        <FiShoppingCart className="mr-3 text-xl" />
                                        {product.isCustom ? 'Start Custom Design' : 'Add to Cart'}
                                    </motion.button>
                                </motion.div>
                            )}

                            {/* Out of Stock Message */}
                            {!canAddToCart && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center bg-red-50 rounded-2xl p-6 border border-red-200"
                                >
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FiCoffee className="text-red-500 text-xl" />
                                    </div>
                                    <p className="text-red-700 font-semibold mb-4 text-lg">This mug is currently unavailable</p>
                                    <button
                                        onClick={() => navigate('/products')}
                                        className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                                    >
                                        Browse Other Mugs
                                    </button>
                                </motion.div>
                            )}
                        </div>
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
