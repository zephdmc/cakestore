// pages/admin/AdminCustomOrders.jsx
import { useState, useEffect } from 'react';
import { getAllCustomOrders, updateCustomOrderStatus } from '../../services/customOrderService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiFilter, 
    FiPackage, 
    FiClock, 
    FiCheckCircle, 
    FiTruck, 
    FiXCircle, 
    FiRefreshCw,
    FiDollarSign,
    FiCalendar,
    FiUser,
    FiImage,
    FiAlertTriangle
} from 'react-icons/fi';

const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: FiClock },
    confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: FiCheckCircle },
    'in-progress': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: FiRefreshCw },
    ready: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: FiPackage },
    delivered: { color: 'bg-green-100 text-green-800 border-green-200', icon: FiTruck },
    cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: FiXCircle }
};

const statusOptions = [
    { value: 'pending', label: 'Pending', icon: FiClock },
    { value: 'confirmed', label: 'Confirmed', icon: FiCheckCircle },
    { value: 'in-progress', label: 'In Progress', icon: FiRefreshCw },
    { value: 'ready', label: 'Ready', icon: FiPackage },
    { value: 'delivered', label: 'Delivered', icon: FiTruck },
    { value: 'cancelled', label: 'Cancelled', icon: FiXCircle }
];

export default function AdminCustomOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [updatingOrder, setUpdatingOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const ordersData = await getAllCustomOrders();
            setOrders(ordersData);
        } catch (error) {
            console.error('Error loading custom orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdatingOrder(orderId);
        try {
            await updateCustomOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (error) {
            console.error('Error updating order status:', error);
        } finally {
            setUpdatingOrder(null);
        }
    };

    const filteredOrders = filter === 'all' 
        ? orders 
        : orders.filter(order => order.status === filter);

    const getStatusCounts = () => {
        const counts = {
            all: orders.length,
            pending: 0,
            confirmed: 0,
            'in-progress': 0,
            ready: 0,
            delivered: 0,
            cancelled: 0
        };
        
        orders.forEach(order => {
            if (order.status in counts) {
                counts[order.status]++;
            }
        });
        
        return counts;
    };

    const statusCounts = getStatusCounts();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Loading custom orders...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom Cake Orders</h1>
                            <p className="text-gray-600">Manage and track all custom cake orders</p>
                        </div>
                        <button
                            onClick={loadOrders}
                            className="flex items-center bg-white text-gray-700 py-3 px-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 font-semibold mt-4 lg:mt-0"
                        >
                            <FiRefreshCw className="mr-2" />
                            Refresh Orders
                        </button>
                    </div>

                    {/* Status Filter */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <FiFilter className="mr-3 text-purple-600" />
                                Filter Orders
                            </h2>
                            <span className="text-sm text-gray-500">
                                {filteredOrders.length} of {orders.length} orders
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                            {[
                                { value: 'all', label: 'All', count: statusCounts.all, color: 'bg-gray-500' },
                                { value: 'pending', label: 'Pending', count: statusCounts.pending, color: 'bg-yellow-500' },
                                { value: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed, color: 'bg-blue-500' },
                                { value: 'in-progress', label: 'In Progress', count: statusCounts['in-progress'], color: 'bg-purple-500' },
                                { value: 'ready', label: 'Ready', count: statusCounts.ready, color: 'bg-orange-500' },
                                { value: 'delivered', label: 'Delivered', count: statusCounts.delivered, color: 'bg-green-500' },
                                { value: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled, color: 'bg-red-500' }
                            ].map(({ value, label, count, color }) => (
                                <button
                                    key={value}
                                    onClick={() => setFilter(value)}
                                    className={`p-4 rounded-xl text-left transition-all duration-200 ${
                                        filter === value 
                                            ? 'bg-white shadow-lg border-2 border-purple-500' 
                                            : 'bg-gray-50 hover:bg-white hover:shadow-md'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className={`w-3 h-3 rounded-full ${color}`}></div>
                                        <span className="text-2xl font-bold text-gray-900">{count}</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">{label}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Orders Grid */}
                <AnimatePresence mode="wait">
                    {filteredOrders.length === 0 ? (
                        <motion.div
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
                                {filter === 'all' 
                                    ? "There are no custom cake orders yet."
                                    : `No orders with status "${filter}" found.`
                                }
                            </p>
                            {filter !== 'all' && (
                                <button
                                    onClick={() => setFilter('all')}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                                >
                                    View All Orders
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key={filter}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid gap-6"
                        >
                            {filteredOrders.map((order, index) => {
                                const StatusIcon = statusConfig[order.status]?.icon || FiClock;
                                
                                return (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                                    >
                                        {/* Order Header */}
                                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                                <div className="flex items-center mb-4 lg:mb-0">
                                                    <div className="bg-white bg-opacity-20 rounded-lg p-2 mr-4">
                                                        <FiPackage className="text-white text-xl" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-white">
                                                            Order #{order.id?.slice(-8).toUpperCase()}
                                                        </h3>
                                                        <div className="flex items-center text-purple-100 text-sm mt-1">
                                                            <FiUser className="mr-1" />
                                                            <span>{order.userEmail}</span>
                                                            <FiCalendar className="ml-3 mr-1" />
                                                            <span>
                                                                {order.createdAt?.toDate 
                                                                    ? new Date(order.createdAt.toDate()).toLocaleDateString()
                                                                    : new Date(order.createdAt).toLocaleDateString()
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-white">
                                                            ₦{order.price?.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <select 
                                                            value={order.status} 
                                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                            disabled={updatingOrder === order.id}
                                                            className="bg-white bg-opacity-20 text-white border border-white border-opacity-30 rounded-lg py-2 px-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-50"
                                                        >
                                                            {statusOptions.map(option => {
                                                                const OptionIcon = option.icon;
                                                                return (
                                                                    <option key={option.value} value={option.value} className="text-gray-900">
                                                                        {option.label}
                                                                    </option>
                                                                );
                                                            })}
                                                        </select>
                                                        {updatingOrder === order.id && (
                                                            <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Content */}
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                                {/* Cake Details */}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                                                        Cake Details
                                                    </h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {[
                                                            ['Occasion', order.occasion],
                                                            ['Size', order.size],
                                                            ['Flavor', order.flavor],
                                                            ['Frosting', order.frosting],
                                                            ['Filling', order.filling || 'None'],
                                                            ['Decorations', order.decorations]
                                                        ].map(([label, value]) => (
                                                            <div key={label} className="bg-gray-50 rounded-lg p-3">
                                                                <span className="text-xs font-medium text-gray-500 block mb-1">
                                                                    {label}
                                                                </span>
                                                                <span className="text-sm font-semibold text-gray-900">
                                                                    {value}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {order.message && (
                                                            <div className="sm:col-span-2 bg-purple-50 rounded-lg p-3 border border-purple-200">
                                                                <span className="text-xs font-medium text-purple-600 block mb-1">
                                                                    Special Message
                                                                </span>
                                                                <span className="text-sm font-semibold text-purple-900">
                                                                    {order.message}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Delivery Information */}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                                        Delivery Information
                                                    </h4>
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            {[
                                                                ['Delivery Date', order.deliveryDate],
                                                                ['Preferred Time', order.deliveryTime || 'Any time'],
                                                                ...(order.allergies ? [['Allergies', order.allergies]] : []),
                                                            ].map(([label, value]) => (
                                                                <div key={label} className="bg-gray-50 rounded-lg p-3">
                                                                    <span className="text-xs font-medium text-gray-500 block mb-1">
                                                                        {label}
                                                                    </span>
                                                                    <span className="text-sm font-semibold text-gray-900">
                                                                        {value}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        
                                                        {order.specialInstructions && (
                                                            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                                                                <span className="text-xs font-medium text-yellow-600 block mb-1">
                                                                    Special Instructions
                                                                </span>
                                                                <span className="text-sm font-semibold text-yellow-900">
                                                                    {order.specialInstructions}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {order.imageUrl && (
                                                            <div className="bg-gray-50 rounded-lg p-4">
                                                                <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                                                    <FiImage className="mr-2" />
                                                                    Reference Image
                                                                </h5>
                                                                <img 
                                                                    src={order.imageUrl} 
                                                                    alt="Reference" 
                                                                    className="h-40 w-full object-contain rounded-lg border border-gray-200 bg-white"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Footer */}
                                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <StatusIcon className={`text-sm mr-2 ${
                                                        statusConfig[order.status]?.color.split(' ')[1]
                                                    }`} />
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                                        statusConfig[order.status]?.color
                                                    }`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Last updated: {new Date().toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
