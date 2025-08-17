import api from './api';

export const getNotifications = async (lastNotificationId = null, limit = 10) => {
    try {
        const response = await api.get('/notifications', {
            params: { lastNotificationId, limit }
        });
        return response.data;
    } catch (error) {
        console.error('Notifications error:', error);
        throw error;
    }
};

export const markAsRead = async (notificationId) => {
    try {
        await api.patch(`/notifications/${notificationId}/read`);
    } catch (error) {
        console.error('Mark as read error:', error);
        throw error;
    }
};

export const markAllAsRead = async () => {
    try {
        await api.patch('/notifications/mark-all-read');
    } catch (error) {
        console.error('Mark all as read error:', error);
        throw error;
    }
};

// Optional: Real-time updates with Firebase
export const subscribeToNotifications = (userId, callback) => {
    const unsubscribe = db.collection('notifications')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .onSnapshot(snapshot => {
            const notifications = [];
            snapshot.forEach(doc => {
                notifications.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(notifications);
        });

    return unsubscribe;
};