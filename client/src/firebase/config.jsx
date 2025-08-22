import { initializeApp } from "firebase/app";
import {
    getAuth,
    onAuthStateChanged,
    signOut,
    getIdTokenResult,
    onIdTokenChanged
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBlafRUKpFjqmtgT2c940bsbeWMqMojLTs",
    authDomain: "stefanosbakeshop-5cf8f.firebaseapp.com",
    projectId: "stefanosbakeshop-5cf8f",
    storageBucket: "stefanosbakeshop-5cf8f.firebasestorage.app",
    messagingSenderId: "893744528427",
    appId: "1:893744528427:web:a31ddada2407f52d1ebe6e"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


// Export all auth-related functions
export {
    auth,
    db,
    app,
    messaging,
    onAuthStateChanged,
    storage,
    signOut,
    getIdTokenResult,
    onIdTokenChanged
};
export const requestNotificationPermission = async (userId) => {
    try {
        if (!('serviceWorker' in navigator)) {
            throw new Error('Service workers not supported');
        }

        // Try to get existing registration first
        let registration = await navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope');

        if (!registration) {
            registration = await navigator.serviceWorker.register(
                '/firebase-messaging-sw.js',
                { scope: '/firebase-cloud-messaging-push-scope' }
            );

            // Wait for service worker to be ready
            if (registration.installing) {
                await new Promise(resolve => {
                    registration.installing.addEventListener('statechange', (e) => {
                        if (e.target.state === 'activated') {
                            resolve();
                        }
                    });
                });
            }
        }

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            throw new Error('Permission not granted');
        }

        const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration
        });

        if (!token) {
            throw new Error('No token received');
        }

        return token;
    } catch (error) {
        console.error('Notification permission error:', error);
        throw error;
    }
};

// Handle incoming messages
export const setupMessageHandler = (callback) => {
    return onMessage(messaging, (payload) => {
        callback(payload);
    });
};
