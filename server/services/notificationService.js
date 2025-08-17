const admin = require('firebase-admin');
const Notification = require('../models/Notification'); // Ensure this path is correct

exports.sendPushNotification = async (userId, { title, body, data = {} }) => {
    try {
        // 1. Get user's FCM token
        const userDoc = await admin.firestore()
            .collection('users')
            .doc(userId)
            .get();

        if (!userDoc.exists) {
            throw new Error('User not found');
        }

        const fcmToken = userDoc.data()?.fcmToken;
        if (!fcmToken) {
            console.log('No FCM token for user:', userId);
            return;
        }

        // 2. Prepare message payload
        const message = {
            token: fcmToken,
            notification: { title, body },
            data,
            android: { priority: 'high' },
            apns: {
                payload: {
                    aps: {
                        'content-available': 1,
                        sound: 'default'
                    }
                }
            }
        };

        // 3. Send notification
        const response = await admin.messaging().send(message);
        console.log('Notification sent:', response);

        // 4. Save to Firestore
        const notification = new Notification({
            userId,
            text: body,
            type: 'push',
            link: data?.link || '',
            metadata: data
        });

        await admin.firestore()
            .collection('notifications')
            .doc(notification.id)
            .set(notification.toFirestore());

        return notification;

    } catch (error) {
        console.error('Push notification failed:', error);

        // Handle specific errors
        if (error.code === 'messaging/invalid-registration-token') {
            console.log('Removing invalid FCM token for user:', userId);
            await admin.firestore()
                .collection('users')
                .doc(userId)
                .update({ fcmToken: null });
        }

        throw error;
    }
};