import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderToDelivered } from '../../services/orderService';
import Loader from '../../components/common/Loader';
import { Link } from 'react-router-dom';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await getAllOrders();
                const ordersData = Array.isArray(response?.data) ? response.data : [];
                setOrders(ordersData);
                setFilteredOrders(ordersData);
            } catch (err) {
                setError(err.message || 'Failed to load orders');
                setOrders([]);
                setFilteredOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, dateFilter, statusFilter, searchQuery]);

    const filterOrders = () => {
        let result = [...orders];

        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(order => {
                if (statusFilter === 'delivered') return order.isDelivered;
                if (statusFilter === 'paid') return order.isPaid && !order.isDelivered;
                if (statusFilter === 'processing') return !order.isPaid;
                return true;
            });
        }

        // Apply date filter
        if (dateFilter !== 'all') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            result = result.filter(order => {
                const orderDate = new Date(order.createdAt);
                switch (dateFilter) {
                    case 'today':
                        return orderDate >= today;
                    case 'week':
                        const weekAgo = new Date(today);
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return orderDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(today);
                        monthAgo.setMonth(monthAgo.getMonth() - 1);
                        return orderDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(order => 
                order.id.toLowerCase().includes(query) || 
                (order.userId && order.userId.toLowerCase().includes(query)) ||
                (order.userEmail && order.userEmail.toLowerCase().includes(query))
            );
        }

        setFilteredOrders(result);
    };

    const handleMarkAsDelivered = async (orderId) => {
        if (window.confirm('Are you sure you want to mark this order as delivered?')) {
            try {
                await updateOrderToDelivered(orderId);
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === orderId ? { ...order, isDelivered: true } : order
                    )
                );
                setSuccess('Order marked as delivered successfully');
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError(err.message || 'Failed to update order');
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusBadge = (order) => {
        if (order.isDelivered) return 'bg-green-100 text-green-800';
        if (order.isPaid) return 'bg-blue-100 text-blue-800';
        return 'bg-yellow-100 text-yellow-800';
    };

    const getStatusText = (order) => {
        if (order.isDelivered) return 'Delivered';
        if (order.isPaid) return 'Paid';
        return 'Processing';
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-0">Order Management</h2>
                
                <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-3">
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary rounded-lg"
                        >
                            <option value="all">All Statuses</option>
                            <option value="processing">Processing</option>
                            <option value="paid">Paid</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>

                    <div className="relative">
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary rounded-lg"
                        >
                            <option value="all">All Dates</option>
                            <option value="today">Today</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                        </select>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-4 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary rounded-lg"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Messages */}
            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-green-700 font-medium">{success}</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-red-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader size="lg" />
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {filteredOrders.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-900">#{order.id.substring(0, 8)}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-500">
                                                        {order.userEmail || `User ${order.userId.substring(0, 8)}`}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(order.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    ₦{order.totalPrice?.toLocaleString() || '0'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order)}`}>
                                                        {getStatusText(order)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                    {!order.isDelivered && (
                                                        <button
                                                            onClick={() => handleMarkAsDelivered(order.id)}
                                                            className="text-primary hover:text-primary-dark hover:underline"
                                                        >
                                                            Mark Delivered
                                                        </button>
                                                    )}
                                                    <Link
                                                        to={`/admin/orders/${order.id}`}
                                                        className="text-primary hover:text-primary-dark hover:underline"
                                                    >
                                                        Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-4 p-4">
                                {filteredOrders.map((order) => (
                                    <div key={order.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900">Order #{order.id.substring(0, 8)}</h3>
                                                <p className="text-xs text-gray-500 mt-1">{order.userEmail || `User ${order.userId.substring(0, 8)}`}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(order)}`}>
                                                {getStatusText(order)}
                                            </span>
                                        </div>
                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-xs text-gray-500">Date</p>
                                                <p className="text-sm text-gray-900">{formatDate(order.createdAt)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Amount</p>
                                                <p className="text-sm font-medium text-gray-900">₦{order.totalPrice?.toLocaleString() || '0'}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-end space-x-3">
                                            {!order.isDelivered && (
                                                <button
                                                    onClick={() => handleMarkAsDelivered(order.id)}
                                                    className="text-sm text-primary hover:text-primary-dark hover:underline"
                                                >
                                                    Mark Delivered
                                                </button>
                                            )}
                                            <Link
                                                to={`/admin/orders/${order.id}`}
                                                className="text-sm text-primary hover:text-primary-dark hover:underline"
                                            >
                                                Details
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
                            <p className="mt-1 text-gray-500 mb-4">
                                {orders.length === 0 
                                    ? "When customers place orders, they will appear here" 
                                    : "No orders match your filters"}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
