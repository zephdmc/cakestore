import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOrderById } from '../../services/orderService';
import { getEnhancedOrderDetails } from '../../services/orderDetailsService'; // Import new service

export default function OrderDetails() {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('orderInfo'); // State for tabs

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

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
                    <p className="text-gray-500">Loading order details....</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <Link
                            to="/orders"
                            className="bg-primary text-white py-2 px-6 rounded hover:bg-primary-dark transition inline-block"
                        >
                            Back to Orders
                        </Link>
                    </div>
                </div>
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
                    <h3 className="mt-2 text-lg font-medium text-white">Order not found</h3>
                    <p className="mt-1 text-gray-500 mb-4">We couldn't find the order you're looking for.</p>
                    <Link
                        to="/orders"
                        className="bg-primary text-white py-2 px-6 rounded hover:bg-primary-dark transition"
                    >
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

// Custom Order Details Tab Content
    const renderCustomOrderDetails = () => (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-purpleDark1">
                <h2 className="text-lg font-medium text-purpleDark1">Custom Cake Details</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-sm font-medium text-purpleDark1 mb-2">Occasion</h3>
                    <p className="text-gray-900">{order.customOrderDetails.occasion}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-purpleDark1 mb-2">Size</h3>
                    <p className="text-gray-900">{order.customOrderDetails.size}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-purpleDark1 mb-2">Flavor</h3>
                    <p className="text-gray-900">{order.customOrderDetails.flavor}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-purpleDark1 mb-2">Frosting</h3>
                    <p className="text-gray-900">{order.customOrderDetails.frosting}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-purpleDark1 mb-2">Filling</h3>
                    <p className="text-gray-900">{order.customOrderDetails.filling}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-purpleDark1 mb-2">Decorations</h3>
                    <p className="text-gray-900">{order.customOrderDetails.decorations}</p>
                </div>
                {order.customOrderDetails.message && (
                    <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-purpleDark1 mb-2">Special Message</h3>
                        <p className="text-gray-900">{order.customOrderDetails.message}</p>
                    </div>
                )}
                <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-purpleDark1 mb-2">Delivery Date & Time</h3>
                    <p className="text-gray-900">
                        {new Date(order.customOrderDetails.deliveryDate).toLocaleDateString()} 
                        {order.customOrderDetails.deliveryTime && ` at ${order.customOrderDetails.deliveryTime}`}
                    </p>
                </div>
                {order.customOrderDetails.allergies && (
                    <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-purpleDark1 mb-2">Allergies</h3>
                        <p className="text-gray-900">{order.customOrderDetails.allergies}</p>
                    </div>
                )}
                {order.customOrderDetails.specialInstructions && (
                    <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-purpleDark1 mb-2">Special Instructions</h3>
                        <p className="text-gray-900 whitespace-pre-wrap">{order.customOrderDetails.specialInstructions}</p>
                    </div>
                )}
                {order.customOrderDetails.imageUrl && (
                    <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-purpleDark1 mb-2">Reference Image</h3>
                        <img 
                            src={order.customOrderDetails.imageUrl} 
                            alt="Cake reference" 
                            className="w-full max-w-md rounded-lg shadow-md"
                        />
                    </div>
                )}
            </div>
        </div>
    );

    // Tab Navigation
    const renderTabNavigation = () => (
        <div className="flex border-b border-gray-200 mb-6">
            <button
                className={`py-2 px-4 font-medium text-sm ${activeTab === 'orderInfo' ? 'border-b-2 border-purpleDark1 text-purpleDark1' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('orderInfo')}
            >
                Order Information
            </button>
            {order.isCustomOrder && order.customOrderDetails && (
                <button
                    className={`py-2 px-4 font-medium text-sm ${activeTab === 'customDetails' ? 'border-b-2 border-purpleDark1 text-purpleDark1' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('customDetails')}
                >
                    Custom Details
                </button>
            )}
        </div>
    );


    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link
                    to="/orders"
                    className="x-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white hover:text-primary-dark rounded-lg hover:opacity-90 transition-all shadow-md"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Orders
                </Link>
                <h1 className="text-2xl text-white font-bold mt-2">Order #{order.id.substring(0, 8)}</h1>
                <p className="text-white">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                </p>
            </div>
 {/* Tab Navigation */}
            {renderTabNavigation()}

 {/* Tab Content */}
            {activeTab === 'orderInfo' ? (
                // Your existing order info content goes here
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                        <div className="px-6 py-4 border-b border-white">
                            <h2 className="text-lg text-white font-medium">Order Items</h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {order.items.map((item, index) => (
                                <div key={index} className="p-6 flex">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="h-20 w-20 rounded object-cover"
                                            src={item.image}
                                            alt={item.name}
                                        />
                                    </div>
                                    <div className="ml-6 flex-1">
                                        <div className="flex items-baseline justify-between">
                                            <h3 className="text-lg font-medium">
                                                <Link to={`/products/${item.productId}`} className="text-purpleDark1 hover:text-primary">
                                                    {item.name}
                                                </Link>
                                            </h3>
                                            <p className="ml-4 text-lg font-medium text-gray-900">
                                                ₦{item.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Quantity: {item.quantity}
                                        </p>
                                        
                                        <p className="mt-2 text-lg font-medium text-purpleDark1">
                                            Subtotal: ₦{(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-purpleDark1">
                            <h2 className="text-lg text-purpleDark1 font-medium">Payment Information</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-purpleDark1">Payment Method</h3>
                                    <p className="mt-1 text-sm text-gray-900 capitalize">
                                        {order.paymentMethod}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-purpleDark1">Payment Status</h3>
                                    <p className="mt-1 text-sm text-purpleLight">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.isPaid ? 'bg-green-100 text-purpleLight' : 'bg-yellow-100 text-purpleDark2'}`}>
                                            {order.isPaid ? 'Paid' : 'Not Paid'}
                                        </span>
                                    </p>
                                </div>
                                {order.isPaid && (
                                    <>
                                        <div>
                                            <h3 className="text-sm font-medium text-purpleDark1">Paid At</h3>
                                            <p className="mt-1 text-sm text-purpleDark1">
                                                {new Date(order.paidAt).toLocaleDateString()} at {new Date(order.paidAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-purpleDark1">Transaction ID</h3>
                                            <p className="mt-1 text-sm text-purpleDark1">
                                                {order.paymentResult?.transactionRef || 'N/A'}
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
                        <div className="px-6 py-4 border-b border-purpleDark1">
                            <h2 className="text-lg font-medium text-purpleDark1">Order Summary</h2>
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
                                <span className="text-lg text-purpleDark1 font-medium">Total</span>
                                <span className="text-lg text-purpleDark1 font-bold">₦{order.totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-purpleDark1">
                            <h2 className="text-lg text-purpleDark1 font-medium">Shipping Information</h2>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-purpleDark1">Delivery Status</h3>
                                <p className="mt-1 text-sm text-gray-900">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {order.isDelivered ? 'Delivered' : 'Processing'}
                                    </span>
                                </p>
                                {order.isDelivered && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-purpleDark1">Contact</h3>
                                    <p className="mt-1 text-sm text-gray-900">{order.shippingAddress.email}</p>
                                    <p className="mt-1 text-sm text-gray-900">{order.shippingAddress.phone}</p>
                                    <p className="mt-1 text-sm text-gray-900">{order.shippingAddress.promocode}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-purpleDark1">Shipping Address</h3>
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
            ) : (
                // Custom Order Details
                renderCustomOrderDetails()
            )}

            
           
        </div>
    );
}
