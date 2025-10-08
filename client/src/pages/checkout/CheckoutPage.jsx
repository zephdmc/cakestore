import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ShippingForm from '../../components/checkout/ShippingForm';
import PaymentForm from '../../components/checkout/PaymentForm';
import OrderConfirmation from '../../components/checkout/OrderConfirmation';
import { createOrder } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { createCustomOrder, updateCustomOrderStatus } from '../../services/customOrderService';
import { 
    FiTruck, 
    FiCreditCard, 
    FiCheckCircle, 
    FiArrowRight,
    FiLoader,
    FiShoppingBag,
    FiGift,
    FiShield
} from 'react-icons/fi';

// Progress Step Component
const ProgressStep = ({ step, currentStep, number, title, icon: Icon }) => (
    <div className="flex-1 flex flex-col items-center">
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`relative flex items-center justify-center w-12 h-12 rounded-2xl font-semibold transition-all duration-500 ${
                step >= currentStep
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white/10 text-white/40 border border-white/20'
            }`}
        >
            {step > currentStep ? (
                <FiCheckCircle className="text-lg" />
            ) : (
                <Icon className="text-lg" />
            )}
            {/* Connection line */}
            {number < 3 && (
                <div className={`absolute top-1/2 left-full w-full h-0.5 transform -translate-y-1/2 ${
                    step > currentStep ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-white/20'
                }`}></div>
            )}
        </motion.div>
        <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mt-3 text-sm font-medium text-center ${
                step >= currentStep ? 'text-white' : 'text-white/40'
            }`}
        >
            {title}
        </motion.p>
    </div>
);

// Processing Overlay Component
const ProcessingOverlay = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 max-w-md mx-4 text-center"
        >
            <motion.div
                animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                }}
                transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity }
                }}
                className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
                <FiLoader className="text-2xl text-white" />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-3">Processing Your Order</h3>
            <p className="text-white/70 mb-4">
                We're securing your {location.state?.isCustomOrder ? 'custom cake' : 'items'} and processing payment...
            </p>
            <div className="flex justify-center space-x-2">
                {[0, 1, 2].map((index) => (
                    <motion.div
                        key={index}
                        animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                            duration: 1.5,
                            repeat: Infinity,
                            delay: index * 0.2
                        }}
                        className="w-2 h-2 bg-white rounded-full"
                    />
                ))}
            </div>
        </motion.div>
    </motion.div>
);

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
                        image: item.images
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                            Checkout
                        </h1>
                        <p className="text-white/70">
                            {isCustomOrder ? 'Complete your custom cake order' : 'Complete your purchase'}
                        </p>
                    </div>
                    <motion.button
                        onClick={goBack}
                        whileHover={{ scale: 1.05, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/20"
                    >
                        <FiArrowRight className="rotate-180 text-sm" />
                        Back
                    </motion.button>
                </motion.div>

                {/* Progress Steps */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-between mb-12 relative"
                >
                    <ProgressStep 
                        step={step} 
                        currentStep={1} 
                        number={1} 
                        title="Shipping" 
                        icon={FiTruck} 
                    />
                    <ProgressStep 
                        step={step} 
                        currentStep={2} 
                        number={2} 
                        title="Payment" 
                        icon={FiCreditCard} 
                    />
                    <ProgressStep 
                        step={step} 
                        currentStep={3} 
                        number={3} 
                        title="Confirmation" 
                        icon={FiCheckCircle} 
                    />
                </motion.div>

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden"
                            >
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
                                {step === 3 && order && (
                                    <OrderConfirmation 
                                        order={order} 
                                        isCustomOrder={isCustomOrder}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 sticky top-8"
                        >
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <FiShoppingBag className="text-purple-300" />
                                Order Summary
                            </h3>

                            {isCustomOrder ? (
                                <div className="space-y-4">
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                                <FiGift className="text-white text-sm" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">Custom Cake</p>
                                                <p className="text-white/60 text-sm">{customOrderData?.occasion}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70 text-sm">Price</span>
                                            <span className="text-white font-semibold">
                                                ₦{Number(customOrderData?.price || 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cartItems.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10"
                                        >
                                            <img
                                                src={item.images}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-lg object-cover border border-white/20"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-medium text-sm truncate">
                                                    {item.name}
                                                </p>
                                                <p className="text-white/60 text-xs">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="text-white font-semibold text-sm">
                                                ₦{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Price Breakdown */}
                            <div className="mt-6 space-y-3 pt-4 border-t border-white/20">
                                <div className="flex justify-between text-white/70">
                                    <span>Subtotal</span>
                                    <span>₦{isCustomOrder ? Number(customOrderData?.price || 0).toLocaleString() : cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-white/70">
                                    <span>Shipping</span>
                                    <span>₦{(shippingData?.shippingPrice || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-white/70">
                                    <span>Tax</span>
                                    <span>₦0</span>
                                </div>
                                <div className="flex justify-between text-white font-semibold text-lg pt-3 border-t border-white/20">
                                    <span>Total</span>
                                    <span>
                                        ₦{(
                                            (isCustomOrder ? Number(customOrderData?.price || 0) : cartTotal) + 
                                            (shippingData?.shippingPrice || 0)
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Security Badge */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-2 mt-6 pt-4 border-t border-white/20"
                            >
                                <FiShield className="text-green-400 text-lg" />
                                <span className="text-white/70 text-sm">Secure SSL Encryption</span>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Processing Overlay */}
            <AnimatePresence>
                {isProcessingOrder && <ProcessingOverlay />}
            </AnimatePresence>
        </div>
    );
}
