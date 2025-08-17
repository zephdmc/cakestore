const express = require('express');
const admin = require('firebase-admin');
const { protect } = require('../middlewares/authMiddleware'); // Import the specific middleware

const router = express.Router();

// FCM Token Update Route
router.patch(
    '/me/fcm-token',
    protect, // Using the protect middleware
    async (req, res, next) => {
        try {
            if (!req.body.fcmToken) {
                return res.status(400).json({
                    success: false,
                    message: 'FCM token is required'
                });
            }

            await admin.firestore()
                .collection('users')
                .doc(req.user.uid) // Using uid from the protect middleware
                .update({
                    fcmToken: req.body.fcmToken,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });

            res.json({
                success: true,
                message: 'FCM token updated successfully'
            });
        } catch (error) {
            console.error('Error saving FCM token:', error);
            next(new ErrorResponse('Failed to update FCM token', 500));
        }
    }
);

module.exports = router;