import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById, updateOrderToDelivered } from '../../services/orderService';
import Loader from '../../components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiArrowLeft, 
    FiPackage, 
    FiCheckCircle, 
    FiClock, 
    FiDollarSign, 
    FiUser, 
    FiMapPin, 
    FiTruck,
    FiCreditCard,
    FiAlertCircle
} from 'react-icons/fi';

export default function AdminOrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const response = await getOrderById(id);
                setOrder(response || null);
            } catch (err) {
                setError(err.response?.message || err.message || 'Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleMarkAsDelivered = async () => {
        if (window.confirm('Are you sure you want to mark this order as delivered?')) {
            try {
                await updateOrderToDelivered(id);
                setOrder(prev => ({
                    ...prev,
                    isDelivered: true,
                    deliveredAt: new Date().toISOString()
                }));
                setSuccess('Order marked as delivered successfully');
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError(err.response?.message || err.message || 'Failed to update order');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <Loader />
                            <p className="mt-4 text-gray-600 font-medium">Loading order details...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-red-500"
                    >
                        <div className="flex items-center mb-4">
                            <FiAlertCircle className="text-red-500 text-xl mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900">Error Loading Order</h3>
                        </div>
                        <p className="text-gray-700 mb-6">{error}</p>
                        <Link
                            to="/admin/orders"
                            className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                        >
                            <FiArrowLeft className="mr-2" />
                            Back to Orders
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto"
                    >
                        <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiPackage className="text-white text-3xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h3>
                        <p className="text-gray-600 mb-8">
                            The order you're looking for doesn't exist or has been removed.
                        </p>
                        <Link
                            to="/admin/orders"
                            className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                        >
                            <FiArrowLeft className="mr-2" />
                            Back to Orders
                        </Link>
                    </motion.div>
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
                    <Link
                        to="/admin/orders"
                        className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold mb-6 group transition-all duration-200"
                    >
                        <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Orders
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-white rounded-2xl shadow-lg p-6">
                        <div className="mb-4 lg:mb-0">
                            <div className="flex items-center mb-2">
                                <h1 className="text-3xl font-bold text-gray-900 mr-4">
                                    Order #{order.id?.substring(0, 8) || 'N/A'}
                                </h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    order.isDelivered 
                                        ? 'bg-green-100 text-green-800 border border-green-200' 
                                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                }`}>
                                    {order.isDelivered ? 'Delivered' : 'Processing'}
                                </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <FiClock className="mr-2" />
                                <span>
                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })} at {new Date(order.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>

                        {!order.isDelivered && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleMarkAsDelivered}
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold flex items-center"
                            >
                                <FiCheckCircle className="mr-2" />
                                Mark as Delivered
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                {/* Success Message */}
                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-4 mb-6 shadow-sm"
                        >
                            <div className="flex items-center">
                                <FiCheckCircle className="text-green-500 text-xl mr-3" />
                                <p className="text-green-700 font-medium">{success}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Column - Order Items & Payment */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Order Items */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                                <h2 className="text-lg font-semibold text-white flex items-center">
                                    <FiPackage className="mr-3" />
                                    Order Items
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {order.items?.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-6 flex items-center hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-20 w-20 rounded-xl object-cover shadow-sm border border-gray-200"
                                                src={item.image}
                                                alt={item.name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/images/placeholder-product.png';
                                                }}
                                            />
                                        </div>
                                        <div className="ml-6 flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                        {item.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Product ID: {item.productId}
                                                    </p>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <p className="text-lg font-bold text-gray-900">
                                                        ₦{item.price?.toLocaleString()}
                                                    </p>
                                                    <p className="mt-2 text-sm font-semibold text-purple-600">
                                                        Subtotal: ₦{((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Payment Information */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                                <h2 className="text-lg font-semibold text-white flex items-center">
                                    <FiCreditCard className="mr-3" />
                                    Payment Information
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Method</h3>
                                        <p className="text-lg font-semibold text-gray-900 capitalize">
                                            {order.paymentMethod}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Status</h3>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            order.isPaid 
                                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                        }`}>
                                            {order.isPaid ? 'Paid' : 'Not Paid'}
                                        </span>
                                    </div>
                                    {order.paymentResult && (
                                        <>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <h3 className="text-sm font-medium text-gray-500 mb-2">Transaction Amount</h3>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    ₦{order.paymentResult.amount?.toLocaleString() || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <h3 className="text-sm font-medium text-gray-500 mb-2">Transaction Reference</h3>
                                                <p className="text-lg font-semibold text-gray-900 font-mono">
                                                    {order.paymentResult.transactionRef || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Date</h3>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {order.paidAt ? new Date(order.paidAt).toLocaleString() : 'N/A'}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <h3 className="text-sm font-medium text-gray-500 mb-2">Transaction Status</h3>
                                                <p className="text-lg font-semibold text-gray-900 capitalize">
                                                    {order.paymentResult.status || 'N/A'}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Summary & Customer Info */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                                <h2 className="text-lg font-semibold text-white flex items-center">
                                    <FiDollarSign className="mr-3" />
                                    Order Summary
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">Items Total</span>
                                        <span className="font-semibold text-gray-900">₦{order.itemsPrice?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-semibold text-gray-900">₦{order.shippingPrice?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-semibold text-gray-900">₦{order.taxPrice?.toLocaleString()}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4 mt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-bold text-gray-900">Total</span>
                                            <span className="text-xl font-bold text-green-600">
                                                ₦{order.totalPrice?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Customer Information */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
                                <h2 className="text-lg font-semibold text-white flex items-center">
                                    <FiUser className="mr-3" />
                                    Customer Information
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-6">
                                    {/* Order Status */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                                            <FiTruck className="mr-2" />
                                            Order Status
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                order.isDelivered 
                                                    ? 'bg-green-100 text-green-800 border border-green-200' 
                                                    : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                            }`}>
                                                {order.isDelivered ? 'Delivered' : 'Processing'}
                                            </span>
                                            {order.isDelivered && order.deliveredAt && (
                                                <p className="text-sm text-gray-500">
                                                    {new Date(order.deliveredAt).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <h3 className="text-sm font-medium text-gray-500 mb-2">User ID</h3>
                                            <p className="text-sm font-semibold text-gray-900 font-mono">
                                                {order.userId}
                                            </p>
                                        </div>

                                        {/* Contact Info */}
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
                                            <div className="space-y-2">
                                                <p className="text-sm font-semibold text-gray-900">{order.shippingAddress?.email}</p>
                                                <p className="text-sm font-semibold text-gray-900">{order.shippingAddress?.phone}</p>
                                                {order.shippingAddress?.promocode && (
                                                    <p className="text-sm font-semibold text-purple-600">
                                                        Promo: {order.shippingAddress.promocode}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Shipping Address */}
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                                                <FiMapPin className="mr-2" />
                                                Shipping Address
                                            </h3>
                                            <div className="text-sm text-gray-900 space-y-1">
                                                <p className="font-semibold">{order.shippingAddress?.address}</p>
                                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                                                <p>{order.shippingAddress?.postalCode}, {order.shippingAddress?.country}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
