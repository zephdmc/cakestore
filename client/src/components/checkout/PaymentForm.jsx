import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiLock, 
  FiCreditCard, 
  FiShield, 
  FiArrowLeft,
  FiCheck,
  FiAlertCircle,
  FiLoader
} from 'react-icons/fi';
import { FaRegCopy } from 'react-icons/fa';

const PaymentForm = ({ 
    amount, 
    onSuccess, 
    onClose, 
    cartItems, 
    isCustomOrder = false,
    shippingData
}) => {
    const { currentUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [scriptReady, setScriptReady] = useState(false);
    const [error, setError] = useState(null);
    const [paymentStep, setPaymentStep] = useState('ready');
    const [copied, setCopied] = useState(false);

    const paymentResolvedRef = useRef(false);

    // Get Flutterwave public key with better validation
    const getFlutterwavePublicKey = () => {
        // Try multiple ways to get the public key
        const publicKey = 
            import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY ||
            process.env.VITE_FLUTTERWAVE_PUBLIC_KEY ||
            import.meta.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY ||
            process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY;

        console.log('Flutterwave Public Key Status:', {
            hasKey: !!publicKey,
            keyLength: publicKey?.length,
            keyStartsWith: publicKey?.substring(0, 10),
            isTestKey: publicKey?.includes('TEST'),
            isLiveKey: publicKey?.includes('LIVE')
        });

        return publicKey;
    };

    const publicKey = getFlutterwavePublicKey();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    // Load Flutterwave script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.flutterwave.com/v3.js';
        script.async = true;
        script.onload = () => {
            setScriptReady(true);
            console.log('Flutterwave script loaded successfully');
        };
        script.onerror = () => {
            console.error('Failed to load Flutterwave script');
            setError('Failed to load payment processor. Please check your internet connection.');
            setScriptReady(false);
        };
        document.body.appendChild(script);
        return () => {
            // Clean up script when component unmounts
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const copyOrderDetails = () => {
        const details = `Payment Amount: ₦${amount.toLocaleString()}\nItems: ${cartItems.length} product(s)`;
        navigator.clipboard.writeText(details);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const initializePayment = async () => {
        if (!scriptReady) {
            setError('Payment processor is still loading. Please wait.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setPaymentStep('processing');

        try {
            // Validate inputs
            if (!currentUser?.email) throw new Error('You must be logged in to pay.');
            if (!amount || amount <= 0) throw new Error('Invalid payment amount.');
            if (amount > 10000000) throw new Error('Amount is too large. Please contact support for large orders.');
            if (!cartItems?.length && !isCustomOrder) throw new Error('Your cart is empty.');

            // Validate Flutterwave public key with better checks
            if (!publicKey) {
                throw new Error('Payment service is not configured. Please contact support.');
            }

            if (publicKey === 'undefined' || publicKey === 'null') {
                throw new Error('Payment configuration error. Please refresh the page.');
            }

            if (!publicKey.startsWith('FLWPUBK') && !publicKey.startsWith('FLWSECK')) {
                throw new Error('Invalid payment configuration. Please contact support.');
            }

            // Generate transaction reference
            const txRef = `BBA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Use customer data from shipping form if available
            const customerEmail = currentUser.email;
            
            // Handle customer name properly
            let customerName = 'Customer';
            if (shippingData) {
                const firstName = shippingData.firstName || '';
                const lastName = shippingData.lastName || '';
                customerName = `${firstName} ${lastName}`.trim() || currentUser.displayName || 'Customer';
            } else {
                customerName = currentUser.displayName || 'Customer';
            }

            // Prepare metadata
            const metaPayload = {
                userId: currentUser.uid,
                txRef: txRef,
                items: JSON.stringify(cartItems.map(item => item?.id).filter(Boolean)),
                isCustomOrder: isCustomOrder
            };

            console.log('Initializing Flutterwave payment with:', {
                amount,
                txRef,
                customerEmail,
                customerName,
                publicKey: publicKey ? '***' + publicKey.slice(-8) : 'MISSING',
                meta: metaPayload
            });

            // Initialize Flutterwave with proper error handling
            if (typeof window.FlutterwaveCheckout !== 'function') {
                throw new Error('Payment processor not loaded properly. Please refresh the page.');
            }

            const flutterwaveConfig = {
                public_key: publicKey,
                tx_ref: txRef,
                amount: amount,
                currency: 'NGN',
                payment_options: 'card, banktransfer, ussd',
                customer: {
                    email: customerEmail,
                    name: customerName,
                    phone_number: shippingData?.phone || ''
                },
                meta: metaPayload,
                customizations: {
                    title: 'Bellebeau Aesthetics',
                    description: isCustomOrder ? 'Custom Cake Order' : `Payment for ${cartItems.length} item(s)`,
                    logo: `${window.location.origin}/images/logo.png`,
                },
                callback: handlePaymentCallback,
                onclose: handlePaymentClose
            };

            console.log('Flutterwave config:', {
                ...flutterwaveConfig,
                public_key: '***' + publicKey.slice(-8) // Hide full key in logs
            });

            window.FlutterwaveCheckout(flutterwaveConfig);

        } catch (error) {
            console.error('Payment initialization error:', error);
            setError(`Payment failed: ${error.message}`);
            setIsLoading(false);
            setPaymentStep('ready');
        }
    };

    const handlePaymentCallback = async (response) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('Payment callback received:', response);
            
            const normalizedStatus = (response.status || '').toString().toLowerCase();
            
            if (['successful', 'success', 'completed'].includes(normalizedStatus)) {
                paymentResolvedRef.current = true;

                setPaymentStep('success');
                
                // Prepare success data
                const successData = {
                    payment: {
                        ...response,
                        transaction_id: response.transaction_id || response.id,
                        tx_ref: response.tx_ref,
                        customer: {
                            email: currentUser.email,
                            name: currentUser.displayName || 'Customer'
                        }
                    },
                    userId: currentUser.uid,
                    cartItems: cartItems.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image
                    })),
                    shippingData: shippingData,
                    isCustomOrder: isCustomOrder
                };

                // Small delay to show success state
                setTimeout(() => {
                    onSuccess(successData);
                }, 1500);

            } else {
                throw new Error(response.message || 'Payment was not completed successfully');
            }

        } catch (error) {
            console.error('Payment callback error:', error);
            setError(error.message || 'Payment processing failed');
            setPaymentStep('ready');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentClose = () => {
        console.log('Payment modal closed');
        setIsLoading(false);
        setPaymentStep('ready');
        if (!paymentResolvedRef.current) {
            onClose();
        }
    };

    // Show specific error if public key is missing
    if (!publicKey) {
        return (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-w-md mx-auto"
            >
                <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold">Payment Error</h3>
                            <p className="text-red-100 text-sm mt-1">Configuration Issue</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                            <FiAlertCircle className="text-xl" />
                        </div>
                    </div>
                </div>

                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FiAlertCircle className="text-red-600 text-2xl" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Payment Service Unavailable</h4>
                    <p className="text-gray-600 mb-6">
                        The payment system is currently being configured. Please try again later or contact support.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-600 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-gray-700 transition-all duration-300"
                    >
                        Return to Shipping
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-w-md mx-auto"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold">Complete Payment</h3>
                        <p className="text-purple-100 text-sm mt-1">Secure checkout with Flutterwave</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                        <FiCreditCard className="text-xl" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                    {paymentStep === 'ready' && (
                        <motion.div
                            key="ready"
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="space-y-6"
                        >
                            {/* Security Badge */}
                            <motion.div
                                variants={itemVariants}
                                className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <FiShield className="text-white text-lg" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-green-800">Secure Payment</p>
                                        <p className="text-green-600 text-sm">Encrypted and protected by Flutterwave</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Order Summary */}
                            <motion.div
                                variants={itemVariants}
                                className="bg-gray-50 rounded-2xl p-4 border border-gray-200"
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-600 font-medium">Total Amount</span>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={copyOrderDetails}
                                        className="text-gray-400 hover:text-purple-600 transition-colors"
                                    >
                                        {copied ? <FiCheck className="text-green-500" /> : <FaRegCopy />}
                                    </motion.button>
                                </div>
                                <div className="text-3xl font-bold text-purple-600 mb-2">
                                    ₦{amount.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <FiLock className="text-xs" />
                                    <span>{cartItems.length} item(s) • Secure transaction</span>
                                </div>
                            </motion.div>

                            {/* Payment Methods */}
                            <motion.div
                                variants={itemVariants}
                                className="space-y-3"
                            >
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>Accepted Payment Methods:</span>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {['Card', 'Bank Transfer', 'USSD'].map((method) => (
                                        <span 
                                            key={method}
                                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                                        >
                                            {method}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Error Display */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-50 border border-red-200 rounded-2xl p-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FiAlertCircle className="text-red-500 text-lg flex-shrink-0" />
                                            <p className="text-red-700 text-sm">{error}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Payment Button */}
                            <motion.button
                                variants={itemVariants}
                                onClick={initializePayment}
                                disabled={isLoading || !scriptReady}
                                whileHover={!isLoading && scriptReady ? { scale: 1.02, y: -2 } : {}}
                                whileTap={!isLoading && scriptReady ? { scale: 0.98 } : {}}
                                className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                                    isLoading || !scriptReady ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-2xl'
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <FiLoader className="text-lg" />
                                        </motion.div>
                                        Initializing Payment...
                                    </>
                                ) : (
                                    scriptReady ? (
                                        <>
                                            <FiLock className="text-lg" />
                                            Pay Securely
                                        </>
                                    ) : (
                                        'Loading Payment...'
                                    )
                                )}
                            </motion.button>
                        </motion.div>
                    )}

                    {/* ... rest of your component remains the same ... */}
                </AnimatePresence>

                {/* Back Button */}
                <motion.button
                    variants={itemVariants}
                    type="button"
                    onClick={handlePaymentClose}
                    className="mt-6 w-full text-gray-600 hover:text-purple-600 font-medium flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                    <FiArrowLeft />
                    Return to Shipping
                </motion.button>
            </div>

            {/* Footer Security */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <FiShield className="text-green-500" />
                    <span>256-bit SSL Secured • PCI DSS Compliant</span>
                </div>
            </div>
        </motion.div>
    );
};

export default PaymentForm;
