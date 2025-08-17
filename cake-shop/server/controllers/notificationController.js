const { db } = require('../config/firebaseConfig');
const Notification = require('../models/Notification');

const notificationsRef = db.collection('notifications');

exports.getNotifications = async (req, res) => {
    try {
        const snapshot = await notificationsRef
            .where('userId', '==', req.user.uid)
            .orderBy('createdAt', 'desc')
            .limit(10)
            .get();

        const notifications = [];
        snapshot.forEach(doc => {
            notifications.push(Notification.fromFirestore(doc.id, doc.data()));
        });

        res.json(notifications);
    } catch (error) {
        console.error('Error getting notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};

exports.markNotificationAsRead = async (req, res) => {
    try {
        await notificationsRef.doc(req.params.id).update({
            read: true
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Error updating notification' });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        const snapshot = await notificationsRef
            .where('userId', '==', req.user.uid)
            .where('read', '==', false)
            .get();

        const batch = db.batch();
        snapshot.forEach(doc => {
            batch.update(doc.ref, { read: true });
        });

        await batch.commit();
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ message: 'Error updating notifications' });
    }
};

// Optional: Create notification helper
exports.createNotification = async (userId, notificationData) => {
    try {
        const notification = new Notification({
            userId,
            ...notificationData
        });
        await notificationsRef.doc(notification.id).set(notification.toFirestore());
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};