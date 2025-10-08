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
    FiShield,
    FiArrowLeft
} from 'react-icons/fi';

// Fixed Progress Step Component
const ProgressStep = ({ currentStep, number, title, icon: Icon }) => (
    <div className="flex-1 flex flex-col items-center">
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl font-semibold transition-all duration-500 ${
                currentStep > number 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' // Completed steps
                    : currentStep === number
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' // Current step
                    : 'bg-white/10 text-white/40 border border-white/20' // Future steps
            }`}
        >
            {currentStep > number ? (
                <FiCheckCircle className="text-base md:text-lg" />
            ) : (
                <Icon className="text-base md:text-lg" />
            )}
            {/* Connection line - hide on small screens */}
            {number < 3 && (
                <div className={`hidden md:block absolute top-1/2 left-full w-full h-0.5 transform -translate-y-1/2 ${
                    currentStep > number ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-white/20'
                }`}></div>
            )}
        </motion.div>
        <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mt-2 md:mt-3 text-xs md:text-sm font-medium text-center ${
                currentStep >= number ? 'text-white' : 'text-white/40'
            }`}
        >
            {title}
        </motion.p>
    </div>
);

// Mobile-friendly Processing Overlay Component
const ProcessingOverlay = ({ isCustomOrder }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 max-w-md w-full mx-auto text-center"
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
                className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6"
            >
                <FiLoader className="text-xl md:text-2xl text-white" />
            </motion.div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Processing Your Order</h3>
            <p className="text-white/70 text-sm md:text-base mb-4 md:mb-4">
                We're securing your {isCustomOrder ? 'custom cake' : 'items'} and processing payment...
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
    const [currentStep, setCurrentStep] = useState(1);
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

    // Handle "Place Order" button click from product page
    useEffect(() => {
        // If coming from product page with "Place Order", ensure we start at step 1
        if (location.state?.fromPlaceOrder) {
            setCurrentStep(1);
        }
    }, [location.state]);

    // Return null or loading spinner while checking auth status
    if (!currentUser) {
        return null;
    }

    const handleShippingSubmit = (data) => {
        setShippingData(data);
        setCurrentStep(2);
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

            setCurrentStep(3);
            setTimeout(() => navigate(`/orders/${createdOrder.data.id}`), 5000);
        } catch (error) {
            console.error('Order creation failed:', error);
            alert(`Order processing failed: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsProcessingOrder(false);
        }
    };

    const goBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 py-4 md:py-8">
            <div className="container mx-auto px-3 md:px-4 max-w-6xl">
                {/* Mobile Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-6 md:mb-8"
                >
                    <div className="flex items-center gap-3">
                        {/* Mobile back button */}
                        <button
                            onClick={goBack}
                            className="md:hidden bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                        >
                            <FiArrowLeft className="text-sm" />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                                Checkout
                            </h1>
                            <p className="text-white/70 text-sm md:text-base">
                                {isCustomOrder ? 'Complete your custom cake order' : 'Complete your purchase'}
                            </p>
                        </div>
                    </div>
                    
                    {/* Desktop back button */}
                    <motion.button
                        onClick={goBack}
                        whileHover={{ scale: 1.05, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/20"
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
                    className="flex justify-between mb-8 md:mb-12 relative px-2"
                >
                    <ProgressStep 
                        currentStep={currentStep} 
                        number={1} 
                        title="Shipping" 
                        icon={FiTruck} 
                    />
                    <ProgressStep 
                        currentStep={currentStep} 
                        number={2} 
                        title="Payment" 
                        icon={FiCreditCard} 
                    />
                    <ProgressStep 
                        currentStep={currentStep} 
                        number={3} 
                        title="Confirmation" 
                        icon={FiCheckCircle} 
                    />
                </motion.div>

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white/10 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-white/20 overflow-hidden"
                            >
                                {currentStep === 1 && (
                                    <ShippingForm 
                                        onSubmit={handleShippingSubmit} 
                                        isCustomOrder={isCustomOrder}
                                    />
                                )}
                                {currentStep === 2 && (
                                    <PaymentForm
                                        amount={isCustomOrder ? (Number(customOrderData?.price) + (shippingData?.shippingPrice || 0)) : (cartTotal + (shippingData?.shippingPrice || 0))}
                                        onSuccess={handlePaymentSuccess}
                                        onClose={() => setCurrentStep(1)}
                                        cartItems={cartItems}
                                        isCustomOrder={isCustomOrder}
                                        shippingData={shippingData}
                                    />
                                )}
                                {currentStep === 3 && order && (
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
                            className="bg-white/10 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-white/20 p-4 md:p-6 sticky top-4 md:top-8 max-h-[80vh] overflow-y-auto"
                        >
                            <h3 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                                <FiShoppingBag className="text-purple-300" />
                                Order Summary
                            </h3>

                            {isCustomOrder ? (
                                <div className="space-y-3 md:space-y-4">
                                    <div className="bg-white/5 rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/10">
                                        <div className="flex items-center gap-2 md:gap-3 mb-2">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg md:rounded-xl flex items-center justify-center">
                                                <FiGift className="text-white text-xs md:text-sm" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-medium text-sm md:text-base truncate">Custom Cake</p>
                                                <p className="text-white/60 text-xs md:text-sm truncate">{customOrderData?.occasion}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70 text-xs md:text-sm">Price</span>
                                            <span className="text-white font-semibold text-sm md:text-base">
                                                ₦{Number(customOrderData?.price || 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2 md:space-y-3 max-h-40 md:max-h-64 overflow-y-auto">
                                    {cartItems.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-2 md:gap-3 bg-white/5 rounded-lg md:rounded-xl p-2 md:p-3 border border-white/10"
                                        >
                                            <img
                                                src={item.images}
                                                alt={item.name}
                                                className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover border border-white/20"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-medium text-xs md:text-sm truncate">
                                                    {item.name}
                                                </p>
                                                <p className="text-white/60 text-xs">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="text-white font-semibold text-xs md:text-sm">
                                                ₦{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Price Breakdown */}
                            <div className="mt-4 md:mt-6 space-y-2 md:space-y-3 pt-3 md:pt-4 border-t border-white/20">
                                <div className="flex justify-between text-white/70 text-sm">
                                    <span>Subtotal</span>
                                    <span>₦{isCustomOrder ? Number(customOrderData?.price || 0).toLocaleString() : cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-white/70 text-sm">
                                    <span>Shipping</span>
                                    <span>₦{(shippingData?.shippingPrice || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-white/70 text-sm">
                                    <span>Tax</span>
                                    <span>₦0</span>
                                </div>
                                <div className="flex justify-between text-white font-semibold text-base md:text-lg pt-2 md:pt-3 border-t border-white/20">
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
                                className="flex items-center gap-2 mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/20"
                            >
                                <FiShield className="text-green-400 text-base md:text-lg" />
                                <span className="text-white/70 text-xs md:text-sm">Secure SSL Encryption</span>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Processing Overlay */}
            <AnimatePresence>
                {isProcessingOrder && <ProcessingOverlay isCustomOrder={isCustomOrder} />}
            </AnimatePresence>
        </div>
    );
}
