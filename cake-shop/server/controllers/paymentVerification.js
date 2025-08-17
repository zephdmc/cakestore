// controllers/paymentVerification.js
const { db, admin } = require('../config/firebaseConfig');
const { validateNonce } = require('../utils/securityUtils');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const axios = require('axios');

// @desc    Verify Flutterwave payment
// @route   POST /api/payments/verify
// @access  Private

// Helper: verify with Flutterwave
async function verifyWithFlutterwave(transactionId) {
    try {
        const res = await axios.get(
            `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return res.data; // full Flutterwave payload
    } catch (error) {
        console.error('Flutterwave verification error:', error.response?.data || error.message);
        throw new ErrorResponse(
            error.response?.data?.message || 'Payment verification failed with Flutterwave',
            400
        );
    }
}

// Main verify endpoint
exports.verifyPayment = asyncHandler(async (req, res) => {
    console.log('Verification request received:', {
        headers: req.headers,
        body: req.body,
        user: req.user
    });

    const { transaction_id, tx_ref, nonce, amount: clientAmount } = req.body;

    // 1. Validate required fields
    if (!transaction_id || !tx_ref || !nonce) {
        console.error('Missing required fields');
        return res.status(400).json({
            success: false,
            error: 'Missing required fields: transaction_id, tx_ref, nonce'
        });
    }

    // 2. Validate nonce
    const isNonceValid = await validateNonce(req.user.uid, nonce);
    if (!isNonceValid) {
        console.error('Invalid nonce');
        return res.status(401).json({
            success: false,
            error: 'Invalid or expired nonce'
        });
    }

    // 3. Verify with Flutterwave (live/test depending on secret key)
    const flutterwaveRaw = await verifyWithFlutterwave(transaction_id); // transaction_id is the identifier for verify
    // Expected shape: { status: 'success', message: '...', data: { status: 'successful', tx_ref: '...', amount: ..., currency: ..., customer: {...}, ... } }

    const fwData = flutterwaveRaw?.data;
    if (!(flutterwaveRaw?.status === 'success' && fwData?.status === 'successful')) {
        console.error('Flutterwave returned failed status:', flutterwaveRaw);
        return res.status(400).json({
            success: false,
            error: 'Flutterwave verification failed',
            details: flutterwaveRaw
        });
    }

    // 4. Cross-check tx_ref consistency
    if (fwData.tx_ref !== tx_ref) {
        console.error('tx_ref mismatch', { expected: tx_ref, got: fwData.tx_ref });
        return res.status(400).json({
            success: false,
            error: 'Transaction reference mismatch'
        });
    }

    // 5. Optional: verify amount matches what client expected (to avoid tampering)
    if (clientAmount != null && Number(fwData.amount) !== Number(clientAmount)) {
        console.warn('Amount discrepancy', { flutterwave: fwData.amount, client: clientAmount });
        // You can choose to reject or proceed depending on tolerance
        return res.status(400).json({
            success: false,
            error: 'Payment amount mismatch'
        });
    }
    // 5b. Optional: verify currency matches what you expect
if (fwData.currency !== (req.body.currency || 'NGN')) {
    console.warn('Currency mismatch', { flutterwave: fwData.currency, client: req.body.currency });
    return res.status(400).json({
        success: false,
        error: 'Payment currency mismatch'
    });
}

    // 6. Persist using existing logic (wrap in try/catch if needed)
    const clientData = {
        meta: req.body.meta || {}
    };
    const result = await processPaymentVerification({
        userId: req.user.uid,
        flutterwaveData: fwData,
        clientData
    });

    // 7. Clear nonce was already handled in processPaymentVerification

    // 8. Return normalized shape to frontend
    return res.json({
        success: true,
        payment: {
            id: result.id,
            amount: result.amount,
            status: result.status,
            verifiedAt: new Date().toISOString()
        }
    });
});

async function processPaymentVerification({ userId, flutterwaveData, clientData }) {
    const batch = db.batch();
    const paymentRef = db.collection('payments').doc(flutterwaveData.tx_ref);
    const orderRef = db.collection('orders').doc(`order_${flutterwaveData.tx_ref}`);
    const nonceRef = db.collection('paymentNonces').doc(userId);

    // Payment record
    batch.set(paymentRef, {
        userId,
        amount: flutterwaveData.amount,
        currency: flutterwaveData.currency,
        transactionId: flutterwaveData.id,
        status: flutterwaveData.status,
        paymentMethod: flutterwaveData.payment_type,
        customer: {
            email: flutterwaveData.customer.email,
            name: flutterwaveData.customer.name
        },
        meta: clientData.meta,
        flutterwaveData: flutterwaveData,
        verifiedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // Order record
    batch.set(orderRef, {
        userId,
        paymentReference: flutterwaveData.tx_ref,
        items: clientData.meta.items || [],
        amount: flutterwaveData.amount,
        status: 'paid',
        paymentVerified: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // Clear used nonce
    batch.delete(nonceRef);

    await batch.commit();

    return {
        id: flutterwaveData.tx_ref,
        amount: flutterwaveData.amount,
        status: flutterwaveData.status
    };
}
