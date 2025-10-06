import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import { 
    FiShoppingBag, 
    FiArrowRight, 
    FiTrash2,
    FiHeart,
    FiShoppingCart,
    FiPackage
} from 'react-icons/fi';

// Empty Cart Component
const EmptyCart = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[60vh] flex items-center justify-center"
    >
        <div className="text-center max-w-md mx-auto">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20"
            >
                <FiShoppingCart className="text-4xl text-white/60" />
            </motion.div>
            
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-white mb-4"
            >
                Your Cart is Empty
            </motion.h1>
            
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/70 mb-8 text-lg"
            >
                Looks like you haven't added anything to your cart yet. Let's find something delicious!
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
            >
                <motion(Link)
                    to="/products"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
                >
                    <FiShoppingBag className="text-sm" />
                    Explore Products
                    <FiArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                </motion(Link>
                
                <motion(Link)
                    to="/custom-order"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20"
                >
                    <FiPackage className="text-sm" />
                    Order Custom Cake
                </motion(Link>
            </motion.div>

            {/* Featured Categories */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-12 grid grid-cols-2 gap-4"
            >
                {[
                    { name: 'Birthday Cakes', color: 'from-purple-500 to-pink-500' },
                    { name: 'Wedding Cakes', color: 'from-blue-500 to-cyan-500' },
                    { name: 'Special Occasions', color: 'from-green-500 to-emerald-500' },
                    { name: 'Custom Designs', color: 'from-orange-500 to-red-500' }
                ].map((category, index) => (
                    <motion(Link)
                        key={category.name}
                        to="/products"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`bg-gradient-to-r ${category.color} text-white p-4 rounded-2xl text-center font-medium shadow-lg hover:shadow-xl transition-all duration-300`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                    >
                        {category.name}
                    </motion(Link>
                ))}
            </motion.div>
        </div>
    </motion.div>
);

// Cart Header with Actions
const CartHeader = ({ cartCount, onClearCart }) => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8"
    >
        <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Shopping Cart</h1>
            <p className="text-white/70 flex items-center gap-2">
                <FiShoppingBag className="text-sm" />
                {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
            </p>
        </div>
        
        <div className="flex items-center gap-3">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClearCart}
                className="flex items-center gap-2 bg-white/10 hover:bg-red-500/20 text-white/70 hover:text-red-300 py-3 px-4 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-red-500/30"
            >
                <FiTrash2 className="text-sm" />
                Clear Cart
            </motion.button>
            
            <motion(Link)
                to="/products"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
                <FiArrowRight className="text-sm rotate-180" />
                Continue Shopping
            </motion(Link>
        </div>
    </motion.div>
);

export default function CartPage() {
    const { cartItems, cartCount, clearCart } = useCart();

    if (cartCount === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    <EmptyCart />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <CartHeader cartCount={cartCount} onClearCart={clearCart} />

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Cart Items */}
                    <div className="xl:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden"
                        >
                            {/* Cart Items Header */}
                            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-6 py-4 border-b border-white/20">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                                        <FiShoppingBag className="text-purple-300" />
                                        Your Items ({cartCount})
                                    </h2>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={clearCart}
                                        className="flex items-center gap-2 text-white/70 hover:text-red-300 text-sm font-medium transition-colors duration-300"
                                    >
                                        <FiTrash2 className="text-sm" />
                                        Clear All
                                    </motion.button>
                                </div>
                            </div>

                            {/* Cart Items List */}
                            <div className="divide-y divide-white/10">
                                <AnimatePresence>
                                    {cartItems.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ 
                                                duration: 0.5,
                                                delay: index * 0.1 
                                            }}
                                            layout
                                        >
                                            <CartItem item={item} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Additional Actions */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="p-6 bg-white/5 border-t border-white/10"
                            >
                                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <motion(Link)
                                            to="/products"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300"
                                        >
                                            <FiArrowRight className="text-sm rotate-180" />
                                            Continue Shopping
                                        </motion(Link>
                                        
                                        <motion(Link)
                                            to="/wishlist"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 text-white/70 hover:text-pink-300 transition-colors duration-300"
                                        >
                                            <FiHeart className="text-sm" />
                                            View Wishlist
                                        </motion(Link>
                                    </div>
                                    
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white/5 rounded-xl px-4 py-2 border border-white/10"
                                    >
                                        <span className="text-white font-semibold">
                                            Total: {cartCount} {cartCount === 1 ? 'item' : 'items'}
                                        </span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
                        >
                            {[
                                { 
                                    icon: FiPackage, 
                                    title: 'Free Shipping', 
                                    description: 'On orders over ₦50,000',
                                    color: 'from-purple-500 to-pink-500'
                                },
                                { 
                                    icon: FiHeart, 
                                    title: 'Quality Guarantee', 
                                    description: 'Freshly baked with love',
                                    color: 'from-green-500 to-emerald-500'
                                },
                                { 
                                    icon: FiShoppingBag, 
                                    title: 'Easy Returns', 
                                    description: '30-day satisfaction',
                                    color: 'from-blue-500 to-cyan-500'
                                }
                            ].map((badge, index) => (
                                <motion.div
                                    key={badge.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.1 + index * 0.1 }}
                                    whileHover={{ y: -4 }}
                                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center group hover:border-white/40 transition-all duration-300"
                                >
                                    <div className={`w-12 h-12 bg-gradient-to-r ${badge.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                        <badge.icon className="text-white text-lg" />
                                    </div>
                                    <h3 className="text-white font-semibold mb-1">{badge.title}</h3>
                                    <p className="text-white/60 text-sm">{badge.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Cart Summary */}
                    <div className="xl:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="sticky top-8"
                        >
                            <CartSummary />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
