const { auth, firebase } = require('../config/firebaseConfig');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const { generateToken } = require('../utils/firebaseUtils');

// Admin emails (should be moved to environment variables)
const ADMIN_EMAILS = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : ['admin@example.com'];

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { email, password, name } = req.body;

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
        email,
        password,
        displayName: name
    });

    // Check if the registered email is an admin email
    const isAdmin = ADMIN_EMAILS.includes(email);

    // Set custom claims if admin
    if (isAdmin) {
        await auth.setCustomUserClaims(userRecord.uid, { admin: true });
    }

    // Generate JWT token
    const token = await generateToken(userRecord.uid);

    res.status(201).json({
        success: true,
        token,
        data: {
            uid: userRecord.uid,
            email: userRecord.email,
            name: userRecord.displayName,
            isAdmin
        }
    });
});


// Called after signup/login
exports.saveUserProfile = async (uid, email) => {
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
        await userRef.set({
            email,
            role: 'user', // default role
            createdAt: new Date()
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Initialize Firebase Auth client SDK
    const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
    const authClient = getAuth(firebase);

    // Sign in with email and password using client SDK
    const userCredential = await signInWithEmailAndPassword(authClient, email, password)
        .catch(error => {
            throw new ErrorResponse('Invalid credentials', 401);
        });

    // Get the user's ID token
    const idToken = await userCredential.user.getIdToken();

    // Verify the ID token using Admin SDK
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Get user record from Firebase Admin
    const userRecord = await auth.getUser(uid);

    // Check admin status
    const customClaims = userRecord.customClaims || {};
    const isAdmin = customClaims.admin || ADMIN_EMAILS.includes(email);

    // Update custom claims if needed
    if (isAdmin && !customClaims.admin) {
        await auth.setCustomUserClaims(uid, { admin: true });
        // User needs to reauthenticate to get updated claims
        const updatedToken = await userCredential.user.getIdToken(true);
    }

    // Generate our custom JWT token
    const token = await generateToken(uid);

    res.status(200).json({
        success: true,
        token,
        data: {
            uid: userRecord.uid,
            email: userRecord.email,
            name: userRecord.displayName,
            isAdmin
        }
    });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await auth.getUser(req.user.uid);

    // Get custom claims
    const customClaims = user.customClaims || {};
    const isAdmin = customClaims.admin || ADMIN_EMAILS.includes(user.email);

    res.status(200).json({
        success: true,
        data: {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            isAdmin
        }
    });
});

// @desc    Make user admin (protected route)
// @route   PUT /api/auth/make-admin/:uid
// @access  Private (Admin only)
exports.makeAdmin = asyncHandler(async (req, res, next) => {
    // Check if current user is admin
    if (!req.user.isAdmin) {
        return next(new ErrorResponse('Not authorized to perform this action', 403));
    }

    const { uid } = req.params;

    // Set custom claims
    await auth.setCustomUserClaims(uid, { admin: true });

    res.status(200).json({
        success: true,
        message: 'User granted admin privileges'
    });
});

exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await auth.getUser(req.user.uid);

    res.status(200).json({
        success: true,
        data: {
            uid: user.uid,
            email: user.email,
            name: user.displayName
        }
    });
});