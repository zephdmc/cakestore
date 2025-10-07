import { useState, useEffect } from 'react';
import { getOrders } from '../../services/orderService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiPackage, 
    FiTruck, 
    FiEye, 
    FiRefreshCw, 
    FiFilter,
    FiSearch,
    FiCalendar,
    FiDollarSign,
    FiUser,
    FiAlertCircle,
    FiCheckCircle
} from 'react-icons/fi';

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [updatingOrder, setUpdatingOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, searchQuery, statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getOrders();
            console.log(response, 'order data');
            setOrders(response.data || []);
        } catch (err) {
            setError(err.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let result = [...orders];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(order => 
                order.id.toLowerCase().includes(query) || 
                (order.userId && order.userId.toLowerCase().includes(query)) ||
                (order.userEmail && order.userEmail.toLowerCase().includes(query))
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(order => {
                if (statusFilter === 'shipped') return order.isShipped;
                if (statusFilter === 'processing') return !order.isShipped;
                return true;
            });
        }

        setFilteredOrders(result);
    };

    const markAsShipped = async (orderId) => {
        setUpdatingOrder(orderId);
        try {
            // Implement API call to mark order as shipped
            // await updateOrderStatus(orderId, 'shipped');
            
            // Optimistic update
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, isShipped: true } : order
            ));
        } catch (err) {
            setError(err.message || 'Failed to update order');
        } finally {
            setUpdatingOrder(null);
        }
    };

    const getStatusConfig = (isShipped) => ({
        text: isShipped ? 'Shipped' : 'Processing',
        color: isShipped 
            ? 'bg-green-100 text-green-800 border-green-200' 
            : 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: isShipped ? FiCheckCircle : FiPackage
    });

    const getOrderStats = () => {
        const total = orders.length;
        const shipped = orders.filter(order => order.isShipped).length;
        const processing = orders.filter(order => !order.isShipped).length;
        
        return { total, shipped, processing };
    };

    const stats = getOrderStats();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Loading orders...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
                            <p className="text-gray-600">Manage and track all customer orders</p>
                        </div>
                        <button
                            onClick={fetchOrders}
                            className="flex items-center bg-white text-gray-700 py-3 px-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 font-semibold mt-4 lg:mt-0"
                        >
                            <FiRefreshCw className="mr-2" />
                            Refresh Orders
                        </button>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {[
                            { label: 'Total Orders', value: stats.total, color: 'bg-gradient-to-r from-purple-500 to-pink-500', icon: FiPackage },
                            { label: 'Processing', value: stats.processing, color: 'bg-gradient-to-r from-yellow-500 to-yellow-600', icon: FiPackage },
                            { label: 'Shipped', value: stats.shipped, color: 'bg-gradient-to-r from-green-500 to-green-600', icon: FiTruck }
                        ].map(({ label, value, color, icon: Icon }) => (
                            <motion.div
                                key={label}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-2xl shadow-lg p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                                        <p className="text-sm text-gray-600 mt-1">{label}</p>
                                    </div>
                                    <div className={`${color} rounded-xl p-3`}>
                                        <Icon className="text-white text-xl" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-center">
                                <FiFilter className="text-purple-600 mr-3 text-xl" />
                                <h3 className="text-lg font-semibold text-gray-900">Filter Orders</h3>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 flex-1 lg:justify-end">
                                {/* Search */}
                                <div className="relative flex-1 sm:max-w-xs">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiSearch className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search orders..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                                    />
                                </div>

                                {/* Status Filter */}
                                <div className="relative">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer transition-all duration-200"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <FiPackage className="text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Error Message */}
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
                </AnimatePresence>

                {/* Orders Content */}
                <AnimatePresence mode="wait">
                    {filteredOrders.length > 0 ? (
                        <motion.div
                            key="orders-list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Desktop Table */}
                            <div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gradient-to-r from-purple-600 to-pink-600">
                                            <tr>
                                                {['Order ID', 'Customer', 'Date', 'Total', 'Status', 'Actions'].map((header) => (
                                                    <th
                                                        key={header}
                                                        className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
                                                    >
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredOrders.map((order, index) => {
                                                const statusConfig = getStatusConfig(order.isShipped);
                                                const StatusIcon = statusConfig.icon;
                                                
                                                return (
                                                    <motion.tr
                                                        key={order.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="hover:bg-gray-50 transition-colors duration-200"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <FiPackage className="text-gray-400 mr-3" />
                                                                <span className="text-sm font-semibold text-gray-900 font-mono">
                                                                    #{order.id.substring(0, 8)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <FiUser className="text-gray-400 mr-3" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {order.userEmail || `User ${order.userId?.substring(0, 8) || 'N/A'}`}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        ID: {order.userId?.substring(0, 8)}...
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <FiCalendar className="text-gray-400 mr-3" />
                                                                <span className="text-sm text-gray-900">
                                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <FiDollarSign className="text-gray-400 mr-3" />
                                                                <span className="text-sm font-semibold text-gray-900">
                                                                    ₦{order.totalPrice?.toLocaleString() || '0'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                                                                <StatusIcon className="mr-1" size={12} />
                                                                {statusConfig.text}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex items-center justify-end space-x-3">
                                                                {!order.isShipped && (
                                                                    <button
                                                                        onClick={() => markAsShipped(order.id)}
                                                                        disabled={updatingOrder === order.id}
                                                                        className="flex items-center text-green-600 hover:text-green-700 font-semibold disabled:opacity-50 transition-colors duration-200"
                                                                    >
                                                                        {updatingOrder === order.id ? (
                                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                                                                        ) : (
                                                                            <FiTruck className="mr-1" />
                                                                        )}
                                                                        Mark Shipped
                                                                    </button>
                                                                )}
                                                                <button className="flex items-center text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200">
                                                                    <FiEye className="mr-1" />
                                                                    View
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Cards */}
                            <div className="lg:hidden space-y-4">
                                {filteredOrders.map((order, index) => {
                                    const statusConfig = getStatusConfig(order.isShipped);
                                    const StatusIcon = statusConfig.icon;
                                    
                                    return (
                                        <motion.div
                                            key={order.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center">
                                                    <FiPackage className="text-gray-400 mr-3" />
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">
                                                            Order #{order.id.substring(0, 8)}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {order.userEmail || `User ${order.userId?.substring(0, 8) || 'N/A'}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                                                    <StatusIcon className="mr-1" size={12} />
                                                    {statusConfig.text}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500">Date</p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500">Total</p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        ₦{order.totalPrice?.toLocaleString() || '0'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                                {!order.isShipped && (
                                                    <button
                                                        onClick={() => markAsShipped(order.id)}
                                                        disabled={updatingOrder === order.id}
                                                        className="flex items-center text-green-600 hover:text-green-700 font-semibold disabled:opacity-50 transition-colors duration-200 text-sm"
                                                    >
                                                        {updatingOrder === order.id ? (
                                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600 mr-2"></div>
                                                        ) : (
                                                            <FiTruck className="mr-1" />
                                                        )}
                                                        Mark Shipped
                                                    </button>
                                                )}
                                                <button className="flex items-center text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200 text-sm">
                                                    <FiEye className="mr-1" />
                                                    View
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty-state"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center bg-white rounded-2xl shadow-lg p-12"
                        >
                            <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiPackage className="text-white text-3xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Orders Found</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                {orders.length === 0 
                                    ? "When customers place orders, they will appear here" 
                                    : "No orders match your current filters"
                                }
                            </p>
                            {(searchQuery || statusFilter !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setStatusFilter('all');
                                    }}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
