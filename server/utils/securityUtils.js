const crypto = require('crypto');
const { db } = require('../config/firebaseConfig');

// Validate Flutterwave webhook signature
exports.validateWebhookSignature = (signature) => {
    return signature === process.env.FLUTTERWAVE_SECRET_HASH;
};

// Generate cryptographic nonce
exports.generateNonce = () => {
    return crypto.randomBytes(16).toString('hex');
};

// Validate nonce from client
// exports.validateNonce = async (userId, nonce) => {
//     const doc = await db.collection('paymentNonces').doc(userId).get();
//     if (!doc.exists) return false;

//     const { nonce: storedNonce, expiresAt } = doc.data();
//     return nonce === storedNonce && new Date(expiresAt) > new Date();
// };



exports.validateNonce = async (userId, nonce) => {
    if (!nonce || !userId) return false;

    const nonceDoc = await db.collection('paymentNonces')
        .doc(userId)
        .get();

    if (!nonceDoc.exists) return false;

    const { nonce: storedNonce, expiresAt } = nonceDoc.data();

    // Check if nonce matches and hasn't expired
    return nonce === storedNonce && new Date(expiresAt.toDate()) > new Date();
};