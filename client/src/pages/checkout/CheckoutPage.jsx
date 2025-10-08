import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ShippingForm from '../../components/checkout/ShippingForm';
import PaymentForm from '../../components/checkout/PaymentForm';
import OrderConfirmation from '../../components/checkout/OrderConfirmation';
import { createOrder } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { createCustomOrder, updateCustomOrderStatus } from '../../services/customOrderService';
import { FiArrowLeft, FiCheck, FiTruck, FiCreditCard, FiLoader } from 'react-icons/fi';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { currentUser } = useAuth();
    const [shippingData, setShippingData] = useState(null);
    const [order, setOrder] = useState(null);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);

    // Get state from location
    const isCustomOrder = location.state?.isCustomOrder;
    const customOrderData = location.state?.customOrderData;

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!currentUser) {
            navigate('/login', { state: { from: '/checkout' } });
        }
    }, [currentUser, navigate]);

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

                const shippingPrice = shippingData?.shippingPrice || 0;
                const customOrderPrice = Number(customOrderData.price);

                // 2. THEN, build the order data for the main orders collection
                finalOrderData = {
                    userId: currentUser.uid,
                    items: [{
                        productId: 'custom-cake',
                        name: `Custom ${customOrderData.occasion} Cake`,
                        price: customOrderPrice,
                        quantity: 1
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
                    itemsPrice: customOrderPrice,
                    shippingPrice: shippingPrice,
                    taxPrice: 0,
                    totalPrice: customOrderPrice + shippingPrice,
                    isCustomOrder: true,
                    customOrderId: newlyCreatedCustomOrder.id,
                    customDetails: customOrderData
                };
            } else {
                // Handle regular order
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

            // 4. Update the custom order status to 'confirmed'
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

    const goBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigate(-1);
        }
    };

    // Progress Step Component
    const ProgressStep = ({ stepNumber, title, icon: Icon }) => (
        <div className="flex-1 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                step >= stepNumber 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
            }`}>
                {step > stepNumber ? <FiCheck className="text-xs" /> : <Icon className="text-xs" />}
            </div>
            <p className={`mt-1 text-[10px] font-medium text-center ${
                step >= stepNumber ? 'text-purple-600' : 'text-gray-500'
            }`}>
                {title}
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 py-2 px-2">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={goBack}
                            className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20"
                        >
                            <FiArrowLeft className="text-xs" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-white">Checkout</h1>
                            <p className="text-white/70 text-[10px]">
                                {isCustomOrder ? 'Custom cake order' : 'Complete purchase'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between mb-6 relative px-2">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 -translate-y-1/2 -z-10"></div>
                    <div 
                        className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 -translate-y-1/2 transition-all duration-500 -z-10"
                        style={{ width: `${((step - 1) / 2) * 100}%` }}
                    ></div>
                    <ProgressStep stepNumber={1} title="Shipping" icon={FiTruck} />
                    <ProgressStep stepNumber={2} title="Payment" icon={FiCreditCard} />
                    <ProgressStep stepNumber={3} title="Confirm" icon={FiCheck} />
                </div>

                {/* Content Area */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
                    {step === 1 && (
                        <ShippingForm 
                            onSubmit={handleShippingSubmit} 
                            isCustomOrder={isCustomOrder}
                        />
                    )}
                    
                    {step === 2 && (
                        <PaymentForm
                            amount={isCustomOrder ? (Number(customOrderData?.price) + (shippingData?.shippingPrice || 0)) : (cartTotal + (shippingData?.shippingPrice || 0))}
                            onSuccess={handlePaymentSuccess}
                            onClose={() => setStep(1)}
                            cartItems={cartItems}
                            isCustomOrder={isCustomOrder}
                            shippingData={shippingData}
                        />
                    )}

                    {step === 3 && (
                        isProcessingOrder ? (
                            <div className="p-4 text-center">
                                <div className="flex flex-col items-center justify-center py-8">
                                    <div className="relative mb-4">
                                        <div className="animate-spin rounded-full border-2 border-t-purple-500 border-b-transparent border-l-purple-500 border-r-transparent w-8 h-8"></div>
                                        <FiLoader className="absolute inset-0 m-auto text-purple-500 text-xs" />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm mb-1">Processing transaction</p>
                                        <p className="text-white/70 text-xs">Please wait...</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            order && <OrderConfirmation order={order} isCustomOrder={isCustomOrder} />
                        )
                    )}
                </div>

                {/* Order Summary - Mobile Bottom Sheet */}
                {(step === 1 || step === 2) && (
                    <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-3">
                        <h3 className="text-white font-semibold text-sm mb-2">Order Summary</h3>
                        
                        {isCustomOrder ? (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-white/80 text-xs">
                                    <span>Custom Cake</span>
                                    <span>₦{Number(customOrderData?.price || 0).toLocaleString()}</span>
                                </div>
                                <div className="text-white/60 text-[10px]">
                                    {customOrderData?.occasion} • {customOrderData?.size}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {cartItems.slice(0, 2).map((item) => (
                                    <div key={item.id} className="flex justify-between items-center text-white/80 text-xs">
                                        <span className="truncate flex-1 mr-2">{item.name}</span>
                                        <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                                {cartItems.length > 2 && (
                                    <div className="text-white/60 text-[10px]">
                                        +{cartItems.length - 2} more items
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="border-t border-white/20 mt-2 pt-2">
                            <div className="flex justify-between text-white text-xs">
                                <span>Total</span>
                                <span className="font-semibold">
                                    ₦{(
                                        (isCustomOrder ? Number(customOrderData?.price || 0) : cartTotal) + 
                                        (shippingData?.shippingPrice || 0)
                                    ).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Processing Overlay */}
            {isProcessingOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 max-w-xs w-full text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <FiLoader className="text-white text-lg animate-spin" />
                        </div>
                        <h3 className="text-white font-bold text-sm mb-1">Processing Order</h3>
                        <p className="text-white/70 text-xs">
                            Securing your {isCustomOrder ? 'custom cake' : 'items'}...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
