
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { generateSecurityToken } from '../../utils/securityUtils';
import { logPaymentEvent } from '../../services/analyticsService';
import API from '../../services/api';

import { auth } from '../../firebase/config';
const logoUrl = `${window.location.origin}/images/logo.png`;

const PaymentForm = ({ amount, onSuccess, onClose, cartItems }) => {
    const { currentUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [scriptReady, setScriptReady] = useState(false);
    const [error, setError] = useState(null);


    // near the top of PaymentForm, alongside nonceRef
const paymentResolvedRef = useRef(false);

    // ✅ Use ref to store nonce
    // const nonceRef = useRef('');
    const nonceRef = useRef({
        nonce: '',
        txRef: '',
        securityToken: '',
        userId: ''
    });
    
    // Load Flutterwave script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.flutterwave.com/v3.js';
        script.async = true;
        script.onload = () => {
          
            setScriptReady(true);
        };
        script.onerror = () => {
            console.error('Failed to load Flutterwave script');
            setError('Failed to load payment processor.');
            setScriptReady(false);
        };
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);




    const initializePayment = async () => {
        if (!scriptReady) {
            setError('Payment processor is still loading. Please wait.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (!currentUser?.email) throw new Error('You must be logged in to pay.');
            if (!amount || amount <= 0) throw new Error('Invalid payment amount.');
            if (!cartItems?.length) throw new Error('Your cart is empty.');

            const token = await auth.currentUser.getIdToken(true);

            const nonceResponse = await API.get('/api/payments/payments/nonce', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            // ✅ Store nonce in ref
            nonceRef.current = nonceResponse.nonce;
            const txRef = `BBA_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
            const securityToken = await generateSecurityToken(currentUser.uid, txRef);
            // Store all payment data in ref
            nonceRef.current = {
                nonce: nonceResponse.nonce,
                txRef,
                securityToken,
                userId: currentUser.uid
            };

            await logPaymentEvent('attempt', {
                amount,
                txRef,
                itemsCount: cartItems.length
            });



const itemIds = cartItems
  .map(i => i?.id)
  .filter(id => id !== undefined && id !== null);

// Serialize the array into a string
const metaPayload = {
  securityToken,
  userId: currentUser.uid,
  nonce: nonceRef.current.nonce,
  items: JSON.stringify(itemIds) // <--- serialize here
};


            
            window.FlutterwaveCheckout({
                public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
                tx_ref: txRef,
                amount,
                currency: 'NGN',
                payment_options: 'card, banktransfer, ussd',
                customer: {
                    email: currentUser.email,
                    name: currentUser.displayName || 'Customer',
                    phone_number: ''
                },
                //meta: {
                    //securityToken,
                    //userId: currentUser.uid,
                    //nonce: nonceRef.current.nonce,
                    //items: cartItems.map(item => item.id)
                //},
                  meta: metaPayload,
                customizations: {
                    title: 'Bellebeau Aesthetics',
                    description: 'Payment for skincare products',
                    logo: logoUrl,
                },
                callback: handlePaymentCallback,
                onclose: handlePaymentClose
            });

        } catch (error) {
            console.error('Payment initialization error:', error);
            await logPaymentEvent('initialization_failed', {
                error: error.message,
                amount,
                itemsCount: cartItems.length
            });
            setError(`Payment failed: ${error.message}`);
            setIsLoading(false);
        }
    };

    const handlePaymentCallback = async (response) => {
        setIsLoading(true);
        setError(null);

        try {
          const normalizedStatus = (response.status || '').toString().toLowerCase();
// treat 'successful', 'success', 'completed' as success
if (['successful', 'success', 'completed'].includes(normalizedStatus)) {
                 paymentResolvedRef.current = true; // ← prevent onclose from reverting step
                const token = await auth.currentUser.getIdToken(true);
                const { nonce, txRef, securityToken, userId } = nonceRef.current;
                if (!nonce) throw new Error('Payment nonce missing');

                const verification = await API.post('/api/payments/verify', {
                    ...response,
                    nonce,
                    amount,
                    meta: {
                        userId,
                        items: JSON.stringify(
    cartItems.map(i => i?.id).filter(Boolean)
  ),
                        txRef,
                        securityToken
                    }
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });


                if (verification.success) {
                    await logPaymentEvent('success', {
                        txRef: response.tx_ref,
                        amount: response.amount
                    });

                    onSuccess({
                        payment: {
                            ...response,
                            transaction_id: response.transaction_id || response.id,
                            tx_ref: txRef,
                            customer: {
                                email: currentUser.email,
                                name: currentUser.displayName || 'Customer'
                            }
                        },
                        verification: verification,
                        userId: currentUser.uid,
                        cartItems: cartItems.map(item => ({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            image: item.image
                        }))
                    });

                    // onSuccess(verification.payment);
                } else {
                    throw new Error(verification.error || 'Verification failed');
                }
            } else {
                throw new Error(response.message || 'Payment not completed');
            }

        } catch (error) {
            console.error('Verification error:', {
                message: error.message,
                response: error.response
            });
            setError(error.response?.error || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentClose = () => {
       setIsLoading(false);
    if (!paymentResolvedRef.current) {
        onClose(); // only call if payment didn't already succeed
    }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Payment Details</h3>

            <div className="mb-6 p-4 bg-purpleLighter1 rounded border border-purpleLighter">
                <div className="flex items-center text-purpleDark1 mb-1">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Secure Payment</span>
                </div>
                <p className="text-sm text-purpleDark2">
                    Your payment is securely processed via Flutterwave
                </p>
            </div>

            <div className="mb-6">
                <p className="text-purpleDark2 mb-2">Total Amount:</p>
                <p className="text-2xl font-bold">₦{amount.toLocaleString()}</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-100">
                    {error}
                </div>
            )}

            <button
                onClick={initializePayment}
                disabled={isLoading || !scriptReady}
                className={`w-full bg-purpleLighter text-purpleDark py-3 px-4 rounded hover:bg-purpleDark transition font-medium flex items-center justify-center ${isLoading || !scriptReady ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing Payment...
                    </>
                ) : (
                    scriptReady ? 'Pay Securely with Flutterwave' : 'Loading Payment...'
                )}
            </button>

            <button
                type="button"
                onClick={handlePaymentClose}
                className="mt-4 w-full text-purpleDark hover:text-purpleDark text-sm font-medium"
            >
                ← Return to shipping
            </button>
        </div>
    );
};

export default PaymentForm;
