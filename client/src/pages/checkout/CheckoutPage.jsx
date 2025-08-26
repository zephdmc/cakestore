import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ShippingForm from '../../components/checkout/ShippingForm';
import PaymentForm from '../../components/checkout/PaymentForm';
import OrderConfirmation from '../../components/checkout/OrderConfirmation';
import { createOrder } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { createCustomOrder, updateCustomOrderStatus } from '../../services/customOrderService';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { currentUser } = useAuth();
    const [shippingData, setShippingData] = useState(null);
    const [order, setOrder] = useState(null);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);

    // Get state from location at the top level - REMOVE DUPLICATES
    const isCustomOrder = location.state?.isCustomOrder;
    const customOrderData = location.state?.customOrderData; // This is the correct variable

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!currentUser) {
            navigate('/login', { state: { from: '/checkout' } });
        }
    }, [currentUser, navigate]);

    // Return null or loading spinner while checking auth status
    if (!currentUser) {
        return null;
    }

    const handleShippingSubmit = (data) => {
        setShippingData(data);
        setStep(2);
    };

    const handlePaymentSuccess = async (paymentData) => {
        try {
            setIsProcessingOrder(true);
            let finalOrderData;
            let newlyCreatedCustomOrder = null;

            if (isCustomOrder && customOrderData) {
                // 1. FIRST, save the custom order to Firestore and get its ID
                newlyCreatedCustomOrder = await createCustomOrder(customOrderData, currentUser);

                // 2. THEN, build the order data for the main orders collection
                finalOrderData = {
                    userId: currentUser.uid,
                    items: [{
                        productId: 'custom-cake',
                        name: `Custom ${customOrderData.occasion} Cake`,
                        price: Number(customOrderData.price),
                        quantity: 1,
                        customDetails: customOrderData
                    }],
                    shippingAddress: shippingData,
                    paymentMethod: 'flutterwave',
                    paymentResult: {
                        id: paymentData.transaction_id || paymentData.id,
                        status: paymentData.status,
                        amount: Number(paymentData.amount),
                        currency: paymentData.currency || 'NGN',
                        transactionRef: paymentData.tx_ref,
                        verifiedAt: new Date().toISOString()
                    },
                    itemsPrice: Number(customOrderData.price),
                    shippingPrice: shippingData.shippingPrice,
                    taxPrice: 0,
                    totalPrice: Number(customOrderData.price) + shippingData.shippingPrice,
                    isCustomOrder: true,
                    customOrderId: newlyCreatedCustomOrder.id
                };
            } else {
                // Handle regular order (existing code)
                finalOrderData = {
                    userId: currentUser.uid,
                    items: cartItems.map(item => ({
                        productId: item.id,
                        name: item.name,
                        price: Number(item.price),
                        quantity: Number(item.quantity),
                        image: item.image
                    })),
                    shippingAddress: shippingData,
                    paymentMethod: 'flutterwave',
                    paymentResult: {
                        id: paymentData.transaction_id || paymentData.id,
                        status: paymentData.status,
                        amount: Number(paymentData.amount),
                        currency: paymentData.currency || 'NGN',
                        transactionRef: paymentData.tx_ref,
                        verifiedAt: new Date().toISOString()
                    },
                    itemsPrice: Number(cartTotal),
                    shippingPrice: shippingData.shippingPrice,
                    taxPrice: 0,
                    totalPrice: Number(cartTotal) + shippingData.shippingPrice,
                };
            }

            // 3. Create the main order in your database
            const createdOrder = await createOrder(finalOrderData);
            setOrder(createdOrder);

            // 4. Update the custom order status to 'confirmed' (or 'paid')
            if (isCustomOrder && newlyCreatedCustomOrder.id) {
                await updateCustomOrderStatus(newlyCreatedCustomOrder.id, 'confirmed');
            }

            // 5. Clear cart only for regular orders
            if (!isCustomOrder) {
                clearCart();
            }

            setStep(3);
            setTimeout(() => navigate(`/orders/${createdOrder.data.id}`), 5000);
        } catch (error) {
            console.error('Order creation failed:', error);
            alert(`Order processing failed: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsProcessingOrder(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-2xl font-bold text-white mb-6">Checkout</h1>

            {/* Progress Steps */}
            <div className="flex mb-8">
                {[1, 2, 3].map((stepNumber) => (
                    <div key={stepNumber} className={`flex-1 text-center border-b-2 ${step >= stepNumber ? 'border-primary' : 'border-gray-300'}`}>
                        <span className={`inline-block py-2 px-4 rounded-full ${step >= stepNumber ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                            {stepNumber}
                        </span>
                        <p className="mt-2 text-sm">
                            {['Shipping', 'Payment', 'Confirmation'][stepNumber - 1]}
                        </p>
                    </div>
                ))}
            </div>

            {step === 1 && <ShippingForm onSubmit={handleShippingSubmit} />}
            {step === 2 && (
                <PaymentForm
        amount={isCustomOrder ? (Number(customOrderData?.price) + (shippingData?.shippingPrice || 0)) : (cartTotal + (shippingData?.shippingPrice || 0))}
        onSuccess={handlePaymentSuccess}
        onClose={() => setStep(1)}
        cartItems={cartItems}
        isCustomOrder={isCustomOrder} // <-- ADD THIS PROP
    />
            )}
            
            {step === 3 && (
                isProcessingOrder ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-md">
                        <div className="flex items-center space-x-4">
                            <div className="relative w-12 h-12">
                                <div className="animate-spin rounded-full border-4 border-t-primary border-b-transparent border-l-primary border-r-transparent w-12 h-12"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <p className="text-xl font-semibold text-purpleDark">Processing your transaction…</p>
                                <p className="text-sm text-gray-500">This usually takes a few seconds. Please don’t close or refresh.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    order && <OrderConfirmation order={order} />
                )
            )}
        </div>
    );
}
