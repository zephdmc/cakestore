

importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

// Firebase config - use environment variables in vite.config.js
const firebaseConfig = {
    apiKey: "AIzaSyBlafRUKpFjqmtgT2c940bsbeWMqMojLTs", // Replace with your actual API key
    authDomain: "stefanosbakeshop-5cf8f.firebaseapp.com",
    projectId: "stefanosbakeshop-5cf8f",
    storageBucket: "stefanosbakeshop-5cf8f.firebasestorage.app",
    messagingSenderId: "694246190492",
    appId: "1:694246190492:web:a31ddada2407f52d1ebe6e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();


// Background message handler
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);
    const notificationTitle = payload.notification?.title || 'New message';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: payload.notification?.icon || '/logo192.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});




