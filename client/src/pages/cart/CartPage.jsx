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
    FiPackage,
    FiCoffee,
    
} from 'react-icons/fi';

// Create motion-wrapped components at the top level
const MotionLink = motion(Link);

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
                Looks like you haven't added anything to your cart yet. Let's find something perfect for you!
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
            >
                <MotionLink
                    to="/products"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 shadow-lg group"
                >
                    <FiShoppingBag className="text-sm" />
                    Explore Products
                    <FiArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                </MotionLink>
                
                <MotionLink
                    to="/custom-order"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20"
                >
                    <FiPackage className="text-sm" />
                    Order Custom Cake
                </MotionLink>
            </motion.div>

            {/* Featured Categories */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-12 grid grid-cols-2 gap-4"
            >
                {[
                    { name: 'Birthday Cakes', color: 'from-purple-500 to-pink-500', icon: FiCoffee },
                    { name: 'Ceramic Mugs', color: 'from-blue-500 to-teal-500', icon: FiCoffee },
                    { name: 'Custom Designs', color: 'from-orange-500 to-red-500', icon: FiPackage },
                    { name: 'Gift Sets', color: 'from-green-500 to-emerald-500', icon: FiShoppingBag }
                ].map((category, index) => (
                    <MotionLink
                        key={category.name}
                        to="/products"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`bg-gradient-to-r ${category.color} text-white p-4 rounded-2xl text-center font-medium shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                    >
                        <category.icon className="absolute -right-2 -bottom-2 text-white/20 text-3xl group-hover:text-white/30 transition-all duration-300" />
                        {category.name}
                    </MotionLink>
                ))}
            </motion.div>
        </div>
    </motion.div>
);

// Cart Header with Actions
const CartHeader = ({ cartCount, onClearCart, cartType }) => {
    const getHeaderContent = () => {
        switch (cartType) {
            case 'onlyCakes':
                return {
                    title: 'Your Cake Order',
                    subtitle: 'Delicious treats waiting for you!',
                    icon: FiCoffee,
                    gradient: 'from-purple-500/20 to-pink-500/20'
                };
            case 'onlyMugs':
                return {
                    title: 'Your Mug Collection',
                    subtitle: 'Perfect for your favorite drinks!',
                    icon: FiCoffee,
                    gradient: 'from-blue-500/20 to-teal-500/20'
                };
            case 'mixed':
                return {
                    title: 'Your Perfect Combo',
                    subtitle: 'Cakes & mugs - the best of both worlds!',
                    icon: FiShoppingBag,
                    gradient: 'from-purple-500/20 via-blue-500/20 to-teal-500/20'
                };
            default:
                return {
                    title: 'Shopping Cart',
                    subtitle: `${cartCount} ${cartCount === 1 ? 'item' : 'items'} in your cart`,
                    icon: FiShoppingBag,
                    gradient: 'from-purple-500/20 to-pink-500/20'
                };
        }
    };

    const content = getHeaderContent();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8"
        >
            <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{content.title}</h1>
                <p className="text-white/70 flex items-center gap-2">
                    <content.icon className="text-sm" />
                    {content.subtitle}
                    {cartType === 'mixed' && ' 🎉'}
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
                
                <MotionLink
                    to="/products"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/20"
                >
                    <FiArrowRight className="text-sm rotate-180" />
                    Continue Shopping
                </MotionLink>
            </div>
        </motion.div>
    );
};

// Product Type Badge
const ProductTypeBadge = ({ type, count }) => {
    const getBadgeContent = () => {
        switch (type) {
            case 'cake':
                return { icon: FiCoffee, text: `${count} Cake${count > 1 ? 's' : ''}`, color: 'from-purple-500 to-pink-500' };
            case 'mug':
                return { icon: FiCoffee, text: `${count} Mug${count > 1 ? 's' : ''}`, color: 'from-blue-500 to-teal-500' };
            default:
                return { icon: FiShoppingBag, text: `${count} Item${count > 1 ? 's' : ''}`, color: 'from-gray-500 to-gray-600' };
        }
    };

    const content = getBadgeContent();

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`bg-gradient-to-r ${content.color} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg`}
        >
            <content.icon className="text-xs" />
            {content.text}
        </motion.div>
    );
};

export default function CartPage() {
    const { cartItems, cartCount, clearCart } = useCart();

    // Smart cart type detection
    const hasCakes = cartItems.some(item => 
        item.category?.toLowerCase().includes('cake') ||
        item.name?.toLowerCase().includes('cake') ||
        item.flavorTags?.some(tag => tag.toLowerCase().includes('cake'))
    );

    const hasMugs = cartItems.some(item => 
        item.category?.toLowerCase().includes('mug') ||
        item.name?.toLowerCase().includes('mug') ||
        item.materials // Mug-specific field
    );

    const cakeCount = cartItems.filter(item => 
        item.category?.toLowerCase().includes('cake') ||
        item.name?.toLowerCase().includes('cake')
    ).length;

    const mugCount = cartItems.filter(item => 
        item.category?.toLowerCase().includes('mug') ||
        item.name?.toLowerCase().includes('mug') ||
        item.materials
    ).length;

    const cartType = hasCakes && hasMugs ? 'mixed' : 
                    hasCakes ? 'onlyCakes' : 
                    hasMugs ? 'onlyMugs' : 'other';

    // Dynamic background based on cart content
    const getBackgroundGradient = () => {
        switch (cartType) {
            case 'onlyCakes':
                return 'bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700';
            case 'onlyMugs':
                return 'bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700';
            case 'mixed':
                return 'bg-gradient-to-br from-purple-900 via-blue-800 to-teal-700';
            default:
                return 'bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700';
        }
    };

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
        <div className={`min-h-screen py-8 ${getBackgroundGradient()}`}>
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <CartHeader cartCount={cartCount} onClearCart={clearCart} cartType={cartType} />

                {/* Product Type Summary */}
                {(hasCakes || hasMugs) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-2 mb-6"
                    >
                        {hasCakes && <ProductTypeBadge type="cake" count={cakeCount} />}
                        {hasMugs && <ProductTypeBadge type="mug" count={mugCount} />}
                        {cartType === 'mixed' && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-gradient-to-r from-purple-500 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
                            >
                                Perfect Combo! 🎉
                            </motion.div>
                        )}
                    </motion.div>
                )}

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
                            <div className={`px-6 py-4 border-b border-white/20 bg-gradient-to-r ${
                                cartType === 'onlyCakes' ? 'from-purple-500/20 to-pink-500/20' :
                                cartType === 'onlyMugs' ? 'from-blue-500/20 to-teal-500/20' :
                                'from-purple-500/20 via-blue-500/20 to-teal-500/20'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                                            {cartType === 'onlyCakes' ? <FiCoffee className="text-purple-300" /> :
                                             cartType === 'onlyMugs' ? <FiCoffee className="text-blue-300" /> :
                                             <FiShoppingBag className="text-purple-300" />}
                                            Your {cartType === 'onlyCakes' ? 'Cakes' : cartType === 'onlyMugs' ? 'Mugs' : 'Items'} ({cartCount})
                                        </h2>
                                        {cartType === 'mixed' && (
                                            <p className="text-white/80 text-sm mt-1 flex items-center gap-1">
                                                <span>Cakes & Mugs</span>
                                                <span className="text-yellow-300">✨</span>
                                            </p>
                                        )}
                                    </div>
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
                                        <MotionLink
                                            to="/products"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300"
                                        >
                                            <FiArrowRight className="text-sm rotate-180" />
                                            Continue Shopping
                                        </MotionLink>
                                        
                                        <MotionLink
                                            to="/wishlist"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 text-white/70 hover:text-pink-300 transition-colors duration-300"
                                        >
                                            <FiHeart className="text-sm" />
                                            View Wishlist
                                        </MotionLink>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        {hasCakes && <ProductTypeBadge type="cake" count={cakeCount} />}
                                        {hasMugs && <ProductTypeBadge type="mug" count={mugCount} />}
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className="bg-white/5 rounded-xl px-4 py-2 border border-white/10"
                                        >
                                            <span className="text-white font-semibold">
                                                Total: {cartCount} {cartCount === 1 ? 'item' : 'items'}
                                            </span>
                                        </motion.div>
                                    </div>
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
                                    title: cartType === 'onlyMugs' ? 'Secure Packaging' : 'Free Shipping', 
                                    description: cartType === 'onlyMugs' ? 'Bubble-wrapped for safety' : 'On orders over ₦50,000',
                                    color: cartType === 'onlyMugs' ? 'from-blue-500 to-teal-500' : 'from-purple-500 to-pink-500'
                                },
                                { 
                                    icon: cartType === 'onlyCakes' ? FiHeart : FiCoffee, 
                                    title: cartType === 'onlyCakes' ? 'Quality Guarantee' : 'Dishwasher Safe', 
                                    description: cartType === 'onlyCakes' ? 'Freshly baked with love' : 'Easy to clean & maintain',
                                    color: cartType === 'onlyCakes' ? 'from-green-500 to-emerald-500' : 'from-green-500 to-emerald-500'
                                },
                                { 
                                    icon: FiShoppingBag, 
                                    title: cartType === 'mixed' ? 'Perfect Combo' : 'Easy Returns', 
                                    description: cartType === 'mixed' ? 'Cakes & mugs together!' : '30-day satisfaction',
                                    color: cartType === 'mixed' ? 'from-orange-500 to-yellow-500' : 'from-blue-500 to-cyan-500'
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
