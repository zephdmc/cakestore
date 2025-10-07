require('dotenv').config(); // Must be first line!
const app = require('./app.js');
const http = require('http');
const { db, auth } = require('./config/firebaseConfig');
const { verifyFirebase } = require('./config/firebaseConfig');
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Enhanced connection test
async function testFirebaseConnection() {
    try {
        // Test Firestore
        const firestoreTest = db.collection('connection_test').doc('server');
        await firestoreTest.set({
            timestamp: new Date(),
            status: 'active'
        });

        // Test Auth
        const authTest = await auth.listUsers(1);

        console.log('✅ Firebase connection successful');
        console.log(`📊 Firestore: Connected to project`);
        console.log(`👥 Auth: ${authTest.users.length > 0 ? 'Users exist' : 'No users found'}`);
    } catch (err) {
        console.error('❌ Firebase connection failed:', err.message);
        console.error('Verify your service account credentials in .env');
        process.exit(1);
    }
}
async function startServer() {
    try {
        // Verify ALL Firebase services
        await verifyFirebase();

        server.listen(PORT, () => {
            console.log(`🛡️  Server running on port ${PORT}`, {
                environment: process.env.NODE_ENV,
                firebaseProject: firebaseApp.options.projectId
            });
        });
    } catch (error) {
        console.error('🔥 Critical Startup Failure:', error);
        process.exit(1);
    }
}
server.listen(PORT, async () => {
    console.log(`🚀 Starting server in ${process.env.NODE_ENV} mode...`);
    await testFirebaseConnection();

    console.log(`🛡️  Server running on port ${PORT}`);
});

// Enhanced error handling
process.on('unhandledRejection', (err) => {
    console.error('💥 Unhandled Rejection:', err.stack || err.message);
    server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('💤 Process terminated');
        process.exit(0);
    });
});
