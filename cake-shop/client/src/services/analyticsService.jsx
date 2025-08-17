import axios from 'axios';
import { getDeviceFingerprint } from './fingerprintService';
import { auth } from '../firebase/config';
import API from './api';

/**
 * Logs client-side events with security metadata
 */
export const logClientEvent = async (eventData) => {
    try {
        const { eventName, eventData: payload } = eventData;

        // Collect security context
        const securityContext = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            fingerprint: await getDeviceFingerprint(),
            pageUrl: window.location.href,
            ipAddress: '' // Will be captured by backend via headers
        };

        await API.post('/api/payments/logs/client-events', {
            eventName,
            payload,
            securityContext
        }, {
            headers: {
                'X-CSRF-Token': document.cookie
                    .split('; ')
                    .find(row => row.startsWith('XSRF-TOKEN='))
                    ?.split('=')[1]
            }
        });

    } catch (error) {
        console.error('Analytics logging failed:', error);
        // Fallback to console in development
        if (process.env.NODE_ENV === 'development') {
          
        }
    }
};

/**
 * High-security payment event logger
 */
export const logPaymentEvent = async (eventType, metadata) => {
    try {
        const event = {
            type: `payment_${eventType}`,
            timestamp: new Date().toISOString(),
            metadata: {
                ...metadata,
                sensitive: false, // Never log actual payment details
                location: {
                    origin: window.location.origin,
                    path: window.location.pathname
                }
            }
        };

        // Queue for sending (offline handling)
        if (navigator.onLine) {
            if (!auth || !auth.currentUser) throw new Error('User not authenticated');

            const token = await auth.currentUser.getIdToken(true);

            await API.post('/api/payments/logs/payment-events', event, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        } else {
            queueOfflineEvent(event);
        }

    } catch (error) {
        console.error('Payment logging failed:', error);
    }
};

// Offline event queue (uses IndexedDB)
const queueOfflineEvent = (event) => {
    if ('indexedDB' in window) {
        const request = indexedDB.open('AnalyticsQueue', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore('events', { autoIncrement: true });
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction('events', 'readwrite');
            transaction.objectStore('events').add(event);
        };
    }
};
