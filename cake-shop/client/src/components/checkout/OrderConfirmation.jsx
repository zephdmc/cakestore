import { useEffect } from 'react';
import { Link } from 'react-router-dom';


const OrderConfirmation = ({ order }) => {

  
    useEffect(() => {
        // Track conversion in analytics
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'purchase',
            ecommerce: {
                transaction_id: order.data.id,
                value: order.data.totalPrice,
                currency: 'NGN',
                items: order.data.items.map(item => ({
                    item_id: item.productId,
                    item_name: item.name,
                    price: item.price,
                    quantity: item.quantity
                }))
            }
        });
    }, [order]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purpleLighter:  mb-4">
                <svg className="h-10 w-10 text-purplegradient" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>

            <h2 className="text-2xl font-bold text-purpleDark mb-2">Order Confirmed!</h2>
            <p className="text-gray-600 mb-6">Thank you for your purchase. Your order #{order.data.id} has been received.</p>

            <div className="bg-gray-purpleLighter1 p-4 rounded-lg mb-6 text-left">
                <h3 className="font-medium text-purpleDark1 mb-2">Order Summary</h3>
                <p className="text-purpleDark">Amount Paid: <span className="font-medium">₦{order.data.totalPrice.toLocaleString()}</span></p>
                <p className="text-purpleDark">Payment Method: <span className="font-medium">Flutterwave</span></p>
                <p className="text-purpleDark">Date: <span className="font-medium">{new Date(order.data.createdAt).toLocaleString()}</span></p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    to={`/orders/${order.data.id}`}
                    className="bg-primary text-purpleDark py-2 px-6 rounded hover:bg-purpleDark1 transition font-medium"
                >
                    View Order Details
                </Link>
                <Link
                    to="/products"
                    className="border border-purpleLighter text-purpleDark py-2 px-6 rounded hover:bg-purpleLighter1 transition font-medium"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmation;
