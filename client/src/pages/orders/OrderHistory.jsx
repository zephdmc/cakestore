import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getOrdersByUser } from '../../services/orderService';
import { 
    FiPackage, 
    FiShoppingBag, 
    FiCalendar, 
    FiDollarSign, 
    FiTrendingUp,
    FiArrowRight,
    FiArrowLeft,
    FiChevronRight,
    FiCheckCircle,
    FiClock,
    FiTruck,
    FiAlertCircle,
    FiSearch
} from 'react-icons/fi';

// Loading Skeleton Component
const OrderSkeleton = () => (
    <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="h-6 bg-white/20 rounded w-32"></div>
                        <div className="h-4 bg-white/20 rounded w-24"></div>
                    </div>
                    <div className="h-8 bg-white/20 rounded w-20"></div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <div className="h-6 bg-white/20 rounded w-24"></div>
                    <div className="h-4 bg-white/20 rounded w-16"></div>
                </div>
            </div>
        ))}
    </div>
);

// Status Badge Component
const StatusBadge = ({ order }) => {
    const getStatusConfig = () => {
        if (order.isDelivered) return { 
            color: 'from-green-500 to-emerald-500', 
            text: 'Delivered', 
            icon: FiCheckCircle 
        };
        if (order.isPaid) return { 
            color: 'from-blue-500 to-cyan-500', 
            text: 'Processing', 
            icon: FiPackage 
        };
        return { 
            color: 'from-yellow-500 to-orange-500', 
            text: 'Pending Payment', 
            icon: FiClock 
        };
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
        <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center gap-2 bg-gradient-to-r ${config.color} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg`}
        >
            <Icon className="text-xs" />
            {config.text}
        </motion.span>
    );
};

// Order Card Component
const OrderCard = ({ order, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ 
            y: -4,
            transition: { duration: 0.3 }
        }}
        className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden group hover:border-white/40 transition-all duration-500"
    >
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <FiPackage className="text-white text-lg" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            Order #{order.id.substring(0, 8)}
                        </h3>
                        <p className="text-white/70 text-sm flex items-center gap-1">
                            <FiCalendar className="text-xs" />
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <StatusBadge order={order} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-white/70 text-sm">Total Amount</p>
                    <p className="text-white font-semibold text-lg flex items-center gap-1">
                        <FiDollarSign className="text-purple-300" />
                        ₦{order.totalPrice.toLocaleString()}
                    </p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-white/70 text-sm">Items</p>
                    <p className="text-white font-semibold">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div className="flex items-center gap-2">
                    {order.isCustomOrder && (
                        <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-1 rounded-full text-xs font-medium">
                            Custom Order
                        </span>
                    )}
                    <span className="text-white/60 text-sm">
                        {order.items.length} product{order.items.length > 1 ? 's' : ''}
                    </span>
                </div>
                <motion(Link)
                    to={`/orders/${order.id}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-xl font-medium transition-all duration-300 group-hover:bg-white/20"
                >
                    View Details
                    <FiChevronRight className="transition-transform group-hover:translate-x-1" />
                </motion(Link>
            </div>
        </div>
    </motion.div>
);

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mt-8"
    >
        <motion.button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                currentPage === 1 
                    ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
        >
            <FiArrowLeft className="text-sm" />
            Previous
        </motion.button>

        <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <motion.button
                    key={page}
                    onClick={() => onPageChange(page)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                        currentPage === page 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                            : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                >
                    {page}
                </motion.button>
            ))}
        </div>

        <motion.button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                currentPage === totalPages 
                    ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
        >
            Next
            <FiArrowRight className="text-sm" />
        </motion.button>
    </motion.div>
);

export default function OrderHistory() {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const ordersPerPage = 6;

    useEffect(() => {
        const fetchOrders = async () => {
            if (!currentUser) return;

            try {
                setLoading(true);
                const response = await getOrdersByUser();
                setOrders(response.data || []);
            } catch (err) {
                setError(err.message || 'Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [currentUser]);

    // Filter orders based on search term
    const filteredOrders = orders.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.totalPrice.toString().includes(searchTerm)
    );

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    // Stats calculation
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const deliveredOrders = orders.filter(order => order.isDelivered).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8"
                >
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Order History</h1>
                        <p className="text-white/70">Track and manage all your orders in one place</p>
                    </div>
                    <motion(Link)
                        to="/products"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg backdrop-blur-sm border border-white/20"
                    >
                        <FiShoppingBag className="text-sm" />
                        Continue Shopping
                    </motion(Link>
                </motion.div>

                {/* Stats Cards */}
                {orders.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                    >
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <FiPackage className="text-white text-xl" />
                                </div>
                                <div>
                                    <p className="text-white/70 text-sm">Total Orders</p>
                                    <p className="text-white text-2xl font-bold">{totalOrders}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                    <FiTrendingUp className="text-white text-xl" />
                                </div>
                                <div>
                                    <p className="text-white/70 text-sm">Total Spent</p>
                                    <p className="text-white text-2xl font-bold">₦{totalSpent.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                    <FiTruck className="text-white text-xl" />
                                </div>
                                <div>
                                    <p className="text-white/70 text-sm">Delivered</p>
                                    <p className="text-white text-2xl font-bold">{deliveredOrders}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Search Bar */}
                {orders.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6"
                    >
                        <div className="relative max-w-md">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 text-lg" />
                            <input
                                type="text"
                                placeholder="Search orders by ID or amount..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl pl-10 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </motion.div>
                )}

                {/* Content */}
                {loading ? (
                    <OrderSkeleton />
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 text-center"
                    >
                        <FiAlertCircle className="text-4xl text-red-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Error Loading Orders</h3>
                        <p className="text-white/80 mb-6">{error}</p>
                        <motion.button
                            onClick={() => window.location.reload()}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
                        >
                            Try Again
                        </motion.button>
                    </motion.div>
                ) : orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <FiPackage className="text-3xl text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">No Orders Yet</h3>
                            <p className="text-white/70 mb-8 max-w-md mx-auto">
                                You haven't placed any orders yet. Start exploring our products and make your first purchase!
                            </p>
                            <motion(Link)
                                to="/products"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-8 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
                            >
                                <FiShoppingBag className="text-sm" />
                                Start Shopping
                            </motion(Link>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        {/* Orders Count */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-between mb-6"
                        >
                            <p className="text-white/70">
                                Showing {Math.min(filteredOrders.length, ordersPerPage)} of {filteredOrders.length} orders
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="text-purple-300 hover:text-purple-200 text-sm font-medium"
                                >
                                    Clear search
                                </button>
                            )}
                        </motion.div>

                        {/* Orders Grid */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                            >
                                {currentOrders.map((order, index) => (
                                    <OrderCard 
                                        key={order.id} 
                                        order={order} 
                                        index={index} 
                                    />
                                ))}
                            </motion.div>
                        </AnimatePresence>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
