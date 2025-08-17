
const admin = require('firebase-admin');
require('dotenv').config(); // Load .env

console.log('[DEBUG] Raw FIREBASE_SERVICE_ACCOUNT env:', process.env.FIREBASE_SERVICE_ACCOUNT?.substring(0, 100));

// Parse the service account JSON
const serviceAccountRaw = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Replace escaped newline characters in private_key only
serviceAccountRaw.private_key = serviceAccountRaw.private_key.replace(/\\n/g, '\n');

// Initialize Firebase Admin SDK
const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccountRaw),
    databaseURL: `https://${serviceAccountRaw.project_id}.firebaseio.com`,
    storageBucket: `${serviceAccountRaw.project_id}.firebasestorage.app`
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

// Optional test
db.collection('_test').doc('connection').set({ timestamp: new Date() })
    .then(() => console.log('✅ Firestore connection verified'))
    .catch(err => console.error('❌ Firestore test failed:', err));

module.exports = { admin, db, auth, storage, firebaseApp };
