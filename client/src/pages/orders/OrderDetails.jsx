import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getOrderById } from '../../services/orderService';
import { getEnhancedOrderDetails } from '../../services/orderDetailsService';
import { 
    FiArrowLeft, 
    FiPackage, 
    FiTruck, 
    FiCreditCard, 
    FiCalendar,
    FiUser,
    FiMapPin,
    FiMail,
    FiPhone,
    FiInfo,
    FiCheckCircle,
    FiClock,
    FiAlertCircle
} from 'react-icons/fi';

// Create motion-wrapped components at the top level
const MotionLink = motion(Link);

// Loading Skeleton Component
const OrderSkeleton = () => (
    <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-8">
                <div className="h-6 bg-white/20 rounded w-48 mb-4"></div>
                <div className="h-8 bg-white/20 rounded w-64 mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-96"></div>
            </div>
            
            {/* Tabs Skeleton */}
            <div className="flex gap-4 mb-6">
                <div className="h-10 bg-white/20 rounded w-32"></div>
                <div className="h-10 bg-white/20 rounded w-32"></div>
            </div>
            
            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/10 rounded-2xl p-6 h-64"></div>
                    <div className="bg-white/10 rounded-2xl p-6 h-48"></div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white/10 rounded-2xl p-6 h-48"></div>
                    <div className="bg-white/10 rounded-2xl p-6 h-64"></div>
                </div>
            </div>
        </div>
    </div>
);

// Status Badge Component
const StatusBadge = ({ status, isPaid, isDelivered }) => {
    const getStatusConfig = () => {
        if (isDelivered) return { color: 'from-green-500 to-emerald-500', text: 'Delivered', icon: FiCheckCircle };
        if (isPaid) return { color: 'from-blue-500 to-cyan-500', text: 'Processing', icon: FiPackage };
        return { color: 'from-yellow-500 to-orange-500', text: 'Pending Payment', icon: FiClock };
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center gap-2 bg-gradient-to-r ${config.color} text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg`}
        >
            <Icon className="text-sm" />
            {config.text}
        </motion.div>
    );
};

// Tab Navigation Component
const TabNavigation = ({ activeTab, setActiveTab, showCustomTab }) => (
    <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-2xl p-2 mb-8 border border-white/20">
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('orderInfo')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'orderInfo' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
        >
            <FiInfo className="text-sm" />
            Order Information
        </motion.button>
        
        {showCustomTab && (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('customDetails')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === 'customDetails' 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
                <FiPackage className="text-sm" />
                Custom Details
            </motion.button>
        )}
    </div>
);

export default function OrderDetails() {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('orderInfo');

    useEffect(() => {
        const fetchOrder = async () => {
            if (!currentUser) return;

            try {
                setLoading(true);
                const response = await getOrderById(id);
                setOrder(response || null);
            } catch (err) {
                setError(err.message || 'Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, currentUser]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    if (loading) return <OrderSkeleton />;

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 text-center">
                        <FiAlertCircle className="text-4xl text-red-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Error Loading Order</h3>
                        <p className="text-white/80 mb-6">{error}</p>
                        <MotionLink
                            to="/orders"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
                        >
                            <FiArrowLeft className="text-sm" />
                            Back to Orders
                        </MotionLink>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <FiPackage className="text-2xl text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Order Not Found</h3>
                        <p className="text-white/70 mb-8">We couldn't find the order you're looking for.</p>
                        <MotionLink
                            to="/orders"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
                        >
                            <FiArrowLeft className="text-sm" />
                            Back to Orders
                        </MotionLink>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Custom Order Details Component
    const CustomOrderDetails = () => (
        <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden"
        >
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-6 py-4 border-b border-white/20">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                    <FiPackage className="text-purple-300" />
                    Custom Cake Details
                </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { label: 'Occasion', value: order.customOrderDetails.occasion },
                    { label: 'Size', value: order.customOrderDetails.size },
                    { label: 'Flavor', value: order.customOrderDetails.flavor },
                    { label: 'Frosting', value: order.customOrderDetails.frosting },
                    { label: 'Filling', value: order.customOrderDetails.filling },
                    { label: 'Decorations', value: order.customOrderDetails.decorations },
                ].map((item, index) => (
                    <motion.div
                        key={item.label}
                        variants={itemVariants}
                        className="bg-white/5 rounded-xl p-4 border border-white/10"
                    >
                        <h3 className="text-sm font-medium text-purple-300 mb-1">{item.label}</h3>
                        <p className="text-white font-medium">{item.value}</p>
                    </motion.div>
                ))}
                
                {order.customOrderDetails.message && (
                    <motion.div variants={itemVariants} className="md:col-span-2 bg-white/5 rounded-xl p-4 border border-white/10">
                        <h3 className="text-sm font-medium text-purple-300 mb-1">Special Message</h3>
                        <p className="text-white font-medium">{order.customOrderDetails.message}</p>
                    </motion.div>
                )}
                
                <motion.div variants={itemVariants} className="md:col-span-2 bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-sm font-medium text-purple-300 mb-1 flex items-center gap-2">
                        <FiCalendar className="text-sm" />
                        Delivery Date & Time
                    </h3>
                    <p className="text-white font-medium">
                        {new Date(order.customOrderDetails.deliveryDate).toLocaleDateString()} 
                        {order.customOrderDetails.deliveryTime && ` at ${order.customOrderDetails.deliveryTime}`}
                    </p>
                </motion.div>

                {order.customOrderDetails.allergies && (
                    <motion.div variants={itemVariants} className="md:col-span-2 bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                        <h3 className="text-sm font-medium text-yellow-300 mb-1">Allergies</h3>
                        <p className="text-white font-medium">{order.customOrderDetails.allergies}</p>
                    </motion.div>
                )}

                {order.customOrderDetails.specialInstructions && (
                    <motion.div variants={itemVariants} className="md:col-span-2 bg-white/5 rounded-xl p-4 border border-white/10">
                        <h3 className="text-sm font-medium text-purple-300 mb-1">Special Instructions</h3>
                        <p className="text-white whitespace-pre-wrap">{order.customOrderDetails.specialInstructions}</p>
                    </motion.div>
                )}

                {order.customOrderDetails.imageUrl && (
                    <motion.div variants={itemVariants} className="md:col-span-2">
                        <h3 className="text-sm font-medium text-purple-300 mb-3">Reference Image</h3>
                        <div className="relative rounded-2xl overflow-hidden border-2 border-white/20">
                            <img 
                                src={order.customOrderDetails.imageUrl} 
                                alt="Cake reference" 
                                className="w-full h-64 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <MotionLink
                                to="/orders"
                                whileHover={{ scale: 1.05, x: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20"
                            >
                                <FiArrowLeft className="text-sm" />
                                Back to Orders
                            </MotionLink>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                                    Order #{order.id.substring(0, 8)}
                                </h1>
                                <p className="text-white/80 flex items-center gap-2 mt-1">
                                    <FiCalendar className="text-sm" />
                                    Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                        <StatusBadge 
                            status={order.status} 
                            isPaid={order.isPaid} 
                            isDelivered={order.isDelivered} 
                        />
                    </div>
                </motion.div>

                {/* Tab Navigation */}
                <TabNavigation 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    showCustomTab={order.isCustomOrder && order.customOrderDetails} 
                />

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {activeTab === 'orderInfo' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Order Items */}
                            <div className="lg:col-span-2 space-y-6">
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden"
                                >
                                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-6 py-4 border-b border-white/20">
                                        <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                                            <FiPackage className="text-purple-300" />
                                            Order Items
                                        </h2>
                                    </div>
                                    <div className="divide-y divide-white/10">
                                        {order.items.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                variants={itemVariants}
                                                className="p-6 flex items-center gap-4 hover:bg-white/5 transition-all duration-300"
                                            >
                                                <div className="flex-shrink-0">
                                                    <div className="relative">
                                                        <img
                                                            className="h-20 w-20 rounded-2xl object-cover border-2 border-white/20"
                                                            src={item.image}
                                                            alt={item.name}
                                                        />
                                                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                            {item.quantity}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-semibold text-white truncate">
                                                        <Link 
                                                            to={`/products/${item.productId}`}
                                                            className="hover:text-purple-300 transition-colors"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </h3>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <p className="text-purple-300 font-medium">
                                                            ₦{item.price.toLocaleString()} each
                                                        </p>
                                                        <p className="text-white font-bold text-lg">
                                                            ₦{(item.price * item.quantity).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Payment Information */}
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden"
                                >
                                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-6 py-4 border-b border-white/20">
                                        <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                                            <FiCreditCard className="text-purple-300" />
                                            Payment Information
                                        </h2>
                                    </div>
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <h3 className="text-sm font-medium text-purple-300 mb-1">Payment Method</h3>
                                            <p className="text-white font-medium capitalize">{order.paymentMethod}</p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <h3 className="text-sm font-medium text-purple-300 mb-1">Payment Status</h3>
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                                                order.isPaid 
                                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                            }`}>
                                                {order.isPaid ? <FiCheckCircle className="text-sm" /> : <FiClock className="text-sm" />}
                                                {order.isPaid ? 'Paid' : 'Pending'}
                                            </span>
                                        </div>
                                        {order.isPaid && (
                                            <>
                                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                                    <h3 className="text-sm font-medium text-purple-300 mb-1">Paid At</h3>
                                                    <p className="text-white font-medium">
                                                        {new Date(order.paidAt).toLocaleDateString()} at {new Date(order.paidAt).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                                    <h3 className="text-sm font-medium text-purple-300 mb-1">Transaction ID</h3>
                                                    <p className="text-white font-mono text-sm">
                                                        {order.paymentResult?.transactionRef || 'N/A'}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Order Summary */}
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden"
                                >
                                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-6 py-4 border-b border-white/20">
                                        <h2 className="text-xl font-semibold text-white">Order Summary</h2>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        {[
                                            { label: 'Items', value: order.itemsPrice },
                                            { label: 'Shipping', value: order.shippingPrice },
                                            { label: 'Tax', value: order.taxPrice },
                                        ].map((item, index) => (
                                            <motion.div
                                                key={item.label}
                                                variants={itemVariants}
                                                className="flex justify-between items-center"
                                            >
                                                <span className="text-white/80">{item.label}</span>
                                                <span className="text-white font-medium">₦{item.value.toLocaleString()}</span>
                                            </motion.div>
                                        ))}
                                        <motion.div
                                            variants={itemVariants}
                                            className="flex justify-between items-center pt-4 border-t border-white/20"
                                        >
                                            <span className="text-xl font-bold text-white">Total</span>
                                            <span className="text-xl font-bold text-white">₦{order.totalPrice.toLocaleString()}</span>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Shipping Information */}
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden"
                                >
                                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-6 py-4 border-b border-white/20">
                                        <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                                            <FiTruck className="text-purple-300" />
                                            Shipping Information
                                        </h2>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <h3 className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                                                <FiUser className="text-sm" />
                                                Contact
                                            </h3>
                                            <div className="space-y-1">
                                                <p className="text-white flex items-center gap-2">
                                                    <FiMail className="text-sm text-purple-300" />
                                                    {order.shippingAddress.email}
                                                </p>
                                                <p className="text-white flex items-center gap-2">
                                                    <FiPhone className="text-sm text-purple-300" />
                                                    {order.shippingAddress.phone}
                                                </p>
                                                {order.shippingAddress.promocode && (
                                                    <p className="text-yellow-300 text-sm">
                                                        Promo: {order.shippingAddress.promocode}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <h3 className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                                                <FiMapPin className="text-sm" />
                                                Shipping Address
                                            </h3>
                                            <p className="text-white text-sm leading-relaxed">
                                                {order.shippingAddress.address},<br />
                                                {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                                                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    ) : (
                        <CustomOrderDetails />
                    )}
                </motion.div>
            </div>
        </div>
    );
}
