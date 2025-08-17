const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function test() {
    try {
        const auth = admin.auth();
        const userCount = (await auth.listUsers()).users.length;
        console.log(`✅ Success! Found ${userCount} users`);
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

test();