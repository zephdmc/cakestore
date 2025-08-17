require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require('../config/keyla.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

// const email = 'zephdmc@gmail.com'; // Change this
const email = 'auaestheticsbellebeau@gmail.com'; // Change this

async function setupAdmin() {
    try {
        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().setCustomUserClaims(user.uid, { admin: true });
        console.log(`Success! ${email} is now an admin`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

setupAdmin();