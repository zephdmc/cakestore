import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById, updateOrderToDelivered } from '../../services/orderService';
import Loader from '../../components/common/Loader';

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
                // Handle the array response from your API
                setOrder(response || null);
            } catch (err) {
                setError(err.response.message || err.message || 'Failed to load order details');
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
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <Loader />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
                <Link
                    to="/admin/orders"
                    className="bg-primary text-white py-2 px-6 rounded hover:bg-primary-dark transition inline-block"
                >
                    Back to Orders
                </Link>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Order not found</h3>
                    <Link
                        to="/admin/orders"
                        className="mt-4 bg-primary text-white py-2 px-6 rounded hover:bg-primary-dark transition inline-block"
                    >
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link
                    to="/admin/orders"
                    className="inline-flex items-center text-primary hover:text-primary-dark"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Orders
                </Link>
                <div className="flex justify-between items-center mt-2">
                    <div>
                        <h1 className="text-2xl font-bold">Order #{order.id.substring(0, 8)}</h1>
                        <p className="text-gray-500">
                            Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                    </div>
                    {!order.isDelivered && (
                        <button
                            onClick={handleMarkAsDelivered}
                            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                        >
                            Mark as Delivered
                        </button>
                    )}
                </div>
            </div>

            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                    <p className="text-green-700">{success}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-medium">Order Items</h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {order.items.map((item, index) => (
                                <div key={index} className="p-6 flex">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="h-20 w-20 rounded object-cover"
                                            src={item.image}
                                            alt={item.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/placeholder-product.png';
                                            }}
                                        />
                                    </div>
                                    <div className="ml-6 flex-1">
                                        <div className="flex items-baseline justify-between">
                                            <h3 className="text-lg font-medium">
                                                {item.name}
                                            </h3>
                                            <p className="ml-4 text-lg font-medium text-gray-900">
                                                ₦{item.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Product ID: {item.productId}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Quantity: {item.quantity}
                                        </p>
                                        <p className="mt-2 text-lg font-medium">
                                            Subtotal: ₦{(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-medium">Payment Information</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                                    <p className="mt-1 text-sm text-gray-900 capitalize">
                                        {order.paymentMethod}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                                    <p className="mt-1 text-sm text-gray-900">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {order.isPaid ? 'Paid' : 'Not Paid'}
                                        </span>
                                    </p>
                                </div>
                                {order.paymentResult && (
                                    <>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Transaction Amount</h3>
                                            <p className="mt-1 text-sm text-gray-900">
                                                ₦{order.paymentResult.amount?.toLocaleString() || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Transaction Reference</h3>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {order.paymentResult.transactionRef || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Payment Date</h3>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {order.paidAt ? new Date(order.paidAt).toLocaleString() : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Transaction Status</h3>
                                            <p className="mt-1 text-sm text-gray-900 capitalize">
                                                {order.paymentResult.status || 'N/A'}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-medium">Order Summary</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between py-2">
                                <span className="text-gray-600">Items</span>
                                <span className="font-medium">₦{order.itemsPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium">₦{order.shippingPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-medium">₦{order.taxPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-4 border-t border-gray-200">
                                <span className="text-lg font-medium">Total</span>
                                <span className="text-lg font-bold">₦{order.totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-medium">Customer Information</h2>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-500">Order Status</h3>
                                <p className="mt-1 text-sm text-gray-900">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {order.isDelivered ? 'Delivered' : 'Processing'}
                                    </span>
                                </p>
                                {order.isDelivered && order.deliveredAt && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        Delivered on {new Date(order.deliveredAt).toLocaleString()}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                                    <p className="mt-1 text-sm text-gray-900">{order.userId}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                                    <p className="mt-1 text-sm text-gray-900">{order.shippingAddress.email}</p>
                                    <p className="mt-1 text-sm text-gray-900">{order.shippingAddress.phone}</p>
                                    <p className="mt-1 text-sm text-gray-900">{order.shippingAddress.promocode}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {order.shippingAddress.address},<br />
                                        {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                                        {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
