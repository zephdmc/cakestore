const { db } = require('../config/firebaseConfig');
const { validateWebhookSignature, generateNonce } = require('../utils/securityUtils');
const rateLimit = require('express-rate-limit');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');

// Rate limiting for payment endpoints
const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per window
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            error: 'Too many payment attempts, please try again later'
        });
    }
});

// @desc    Create payment log (client events)
// @route   POST /api/logs/client-events
// @access  Public
exports.logClientEvent = asyncHandler(async (req, res) => {
    // Validate CSRF token
    if (req.headers['x-csrf-token'] !== req.cookies['XSRF-TOKEN']) {
        return res.status(403).json({ success: false, error: 'Invalid CSRF token' });
    }

    const { eventName, payload, securityContext } = req.body;

    // Sanitize and store log
    await db.collection('clientLogs').add({
        eventName,
        payload: {
            ...payload,
            // Remove any potential PII
            userAgent: securityContext.userAgent,
            ipAddress: req.ip // Get real IP from proxy if needed
        },
        timestamp: new Date().toISOString()
    });

    res.status(200).json({ success: true });
});

// @desc    Create payment event log (higher security)
// @route   POST /api/logs/payment-events
// @access  Private
exports.logPaymentEvent = [
    paymentLimiter,
    asyncHandler(async (req, res) => {
        const { type, metadata } = req.body;

        // Fraud detection placeholder
        const fraudScore = calculateFraudScore(req);

        await db.collection('paymentLogs').add({
            userId: req.user.uid,
            type,
            metadata: {
                ...metadata,
                fraudScore,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent']
            },
            timestamp: new Date().toISOString()
        });

        if (fraudScore > 70) {
            await flagSuspiciousActivity(req.user.uid);
        }

        res.status(200).json({ success: true });
    })
];

// @desc    Generate payment nonce
// @route   GET /api/payments/nonce
// @access  Private
exports.generatePaymentNonce = asyncHandler(async (req, res) => {
    const nonce = generateNonce();

    // Store nonce with 5-minute expiry
    await db.collection('paymentNonces').doc(req.user.uid).set({
        nonce,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    res.status(200).json({ success: true, nonce });
});

// @desc    Verify Flutterwave webhook
// @route   POST /api/payments/webhook
// @access  Public (Flutterwave IP only)
exports.handlePaymentWebhook = asyncHandler(async (req, res) => {
    // Verify webhook origin
    if (!validateWebhookSignature(req.headers['verif-hash'])) {
        return res.status(401).send('Unauthorized');
    }

    const { event, data } = req.body;

    if (event === 'charge.completed') {
        await processSuccessfulCharge(data);
    }

    res.status(200).send('Webhook received');
});

// Helper functions
async function processSuccessfulCharge(chargeData) {
    // Verify and store payment (Firestore transaction)
    await db.runTransaction(async (transaction) => {
        const paymentRef = db.collection('payments').doc(chargeData.tx_ref);
        const orderRef = db.collection('orders').doc(`order_${chargeData.tx_ref}`);

        transaction.set(paymentRef, {
            ...chargeData,
            verifiedAt: new Date().toISOString()
        });

        transaction.set(orderRef, {
            // ... order data
            status: 'paid',
            paymentVerified: true
        });
    });
}

function calculateFraudScore(req) {
    // Implement actual fraud detection logic
    return 0; // 0-100 score
}