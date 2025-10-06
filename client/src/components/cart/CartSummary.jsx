import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingBag, 
  FiTruck, 
  FiPercent, 
  FiCreditCard, 
  FiTrash2,
  FiArrowRight,
  FiShoppingCart
} from 'react-icons/fi';

export default function CartSummary() {
    const { cartTotal, cartCount, clearCart, cartItems } = useCart();

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear your cart? This action cannot be undone.')) {
            clearCart();
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const buttonVariants = {
        hover: { 
            scale: 1.02, 
            y: -2,
            transition: { duration: 0.2 }
        },
        tap: { scale: 0.98 }
    };

    const isCartEmpty = cartCount === 0;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden sticky top-8"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 text-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                        <FiShoppingBag className="text-lg" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Order Summary</h3>
                        <p className="text-purple-100 text-sm">{cartCount} item{cartCount !== 1 ? 's' : ''} in cart</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Summary Items */}
                <motion.div 
                    variants={itemVariants}
                    className="space-y-4 mb-6"
                >
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <FiShoppingCart className="text-purple-600 text-sm" />
                            </div>
                            <span className="text-gray-600">Subtotal</span>
                        </div>
                        <span className="font-semibold text-gray-800">₦{cartTotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FiTruck className="text-blue-600 text-sm" />
                            </div>
                            <span className="text-gray-600">Shipping</span>
                        </div>
                        <span className="text-green-600 font-semibold">Calculated at checkout</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <FiPercent className="text-green-600 text-sm" />
                            </div>
                            <span className="text-gray-600">Tax</span>
                        </div>
                        <span className="text-green-600 font-semibold">Included</span>
                    </div>
                </motion.div>

                {/* Total */}
                <motion.div
                    variants={itemVariants}
                    className="border-t border-gray-200 pt-4 mb-6"
                >
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <FiCreditCard className="text-white text-sm" />
                            </div>
                            <span className="font-bold text-gray-800 text-lg">Total</span>
                        </div>
                        <span className="font-bold text-purple-600 text-xl">₦{cartTotal.toLocaleString()}</span>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                    variants={itemVariants}
                    className="space-y-3"
                >
                    <AnimatePresence>
                        {!isCartEmpty && (
                            <motion.div
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Link
                                    to="/checkout"
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 block"
                                >
                                    <FiCreditCard className="text-lg" />
                                    Proceed to Checkout
                                    <FiArrowRight className="text-lg" />
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {!isCartEmpty && (
                            <motion.button
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={handleClearCart}
                                className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-2xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center gap-3"
                            >
                                <FiTrash2 className="text-lg" />
                                Clear Cart
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {isCartEmpty && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FiShoppingCart className="text-gray-400 text-2xl" />
                            </div>
                            <p className="text-gray-500 mb-4">Your cart is empty</p>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 bg-purple-600 text-white py-3 px-6 rounded-2xl font-semibold hover:bg-purple-700 transition-colors duration-300"
                            >
                                <FiShoppingBag />
                                Continue Shopping
                            </Link>
                        </motion.div>
                    )}
                </motion.div>

                {/* Security Badge */}
                {!isCartEmpty && (
                    <motion.div
                        variants={itemVariants}
                        className="mt-6 pt-6 border-t border-gray-200"
                    >
                        <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                                <FiCreditCard className="text-green-600 text-xs" />
                            </div>
                            <span>Secure SSL Encryption • 100% Protected</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Floating decorative elements */}
            <AnimatePresence>
                {!isCartEmpty && (
                    <>
                        <motion.div
                            animate={{ 
                                y: [0, -10, 0],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{ 
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute -top-2 -right-2 w-4 h-4 bg-purple-300/30 rounded-full"
                        />
                        <motion.div
                            animate={{ 
                                y: [0, 8, 0],
                                opacity: [0.4, 0.7, 0.4]
                            }}
                            transition={{ 
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1
                            }}
                            className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-300/40 rounded-full"
                        />
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
