const express = require('express');
const {
    logClientEvent,
    logPaymentEvent,
    generatePaymentNonce,
    handlePaymentWebhook
} = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');
const { verifyPayment } = require('../controllers/paymentVerification');

const router = express.Router();

router.post('/logs/client-events', logClientEvent);
router.post('/logs/payment-events', protect, logPaymentEvent);
router.get('/payments/nonce', protect, generatePaymentNonce);
router.post('/payments/webhook', handlePaymentWebhook);
router.post('/verify', protect, verifyPayment);
module.exports = router;