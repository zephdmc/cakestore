// const { auth } = require('../config/firebaseConfig');
// const ErrorResponse = require('../utils/ErrorResponse');
// const asyncHandler = require('../utils/asyncHandler');

// // Protect routes
// exports.protect = asyncHandler(async (req, res, next) => {
//     let token;

//     if (
//         req.headers.authorization &&
//         req.headers.authorization.startsWith('Bearer')
//     ) {
//         token = req.headers.authorization.split(' ')[1];
//     } else if (req.cookies.token) {
//         token = req.cookies.token;
//     }

//     if (!token) {
//         return next(new ErrorResponse('Not authorized to access this route', 401));
//     }

//     try {
//         // Verify token
//         const decoded = await auth.verifyIdToken(token);

//         // Attach full user data to request
//         req.user = {
//             uid: decoded.uid,
//             email: decoded.email,
//             role: decoded.role || 'user' // Default role if not specified
//         };

//         next();
//     } catch (err) {
//         console.error('Authentication error:', err);
//         return next(new ErrorResponse('Not authorized to access this route', 401));
//     }
// });

// // Grant access to specific roles
// exports.authorize = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return next(
//                 new ErrorResponse(
//                     `User role ${req.user.role} is not authorized to access this route`,
//                     403
//                 )
//             );
//         }
//         next();
//     };
// };

// exports.authorizeAdmin = async (req, res, next) => {
//     try {
//         const { uid } = req.user; // From previous auth middleware
//         const isAdmin = await verifyAdmin(uid);

//         if (!isAdmin) {
//             return res.status(403).json({ message: 'Admin access required' });
//         }
//         next();
//     } catch (error) {
//         res.status(500).json({ message: 'Admin verification failed' });
//     }
// };


// const { auth } = require('../config/firebaseConfig');
// const ErrorResponse = require('../utils/ErrorResponse');
// const asyncHandler = require('../utils/asyncHandler');

// // Protect routes
// exports.protect = asyncHandler(async (req, res, next) => {
//     let token;

//     if (req.headers.authorization?.startsWith('Bearer')) {
//         token = req.headers.authorization.split(' ')[1];
//     }

//     if (!token) {
//         return next(new ErrorResponse('Not authorized to access this route', 401));
//     }

//     try {
//         // Verify token AND get claims
//         const decoded = await auth.verifyIdToken(token, true); // <-- Check revoked tokens

//         req.user = {
//             uid: decoded.uid,
//             email: decoded.email,
//             role: decoded.claims?.admin ? 'admin' : 'user' // <-- Get role from claims
//         };

//         next();
//     } catch (err) {
//         console.error('🔥 Authentication error:', err);
//         return next(new ErrorResponse('Invalid or expired token', 401));
//     }
// });

// // Simplified authorize middleware
// exports.authorize = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return next(
//                 new ErrorResponse(
//                     `Role ${req.user.role} unauthorized for this route`,
//                     403
//                 )
//             );
//         }
//         next();
//     };
// };

// // Remove authorizeAdmin (redundant since we get claims from verifyIdToken)


// const { auth } = require('../config/firebaseConfig');
// const ErrorResponse = require('../utils/ErrorResponse');
// // const asyncHandler = require('../utils/asyncHandler');
// // middlewares/authMiddleware.js
// const admin = require('firebase-admin');

// const protect = async (req, res, next) => {
//     try {
//         // 1. Get token from header
//         let token;
//         if (
//             req.headers.authorization &&
//             req.headers.authorization.startsWith('Bearer')
//         ) {
//             token = req.headers.authorization.split(' ')[1];
//         }

//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 error: 'Not authorized to access this route'
//             });
//         }

//         // 2. Verify token
//         // const decoded = await admin.auth().verifyIdToken(token);
//         try {
//             const decoded = await admin.auth().verifyIdToken(token);
//             console.log('Token successfully decoded:', {
//                 uid: decoded.uid,
//                 email: decoded.email,
//                 iat: new Date(decoded.iat * 1000),
//                 exp: new Date(decoded.exp * 1000)
//             });
//         } catch (verifyError) {
//             console.error('Token verification failed:', {
//                 code: verifyError.code,
//                 message: verifyError.message,
//                 currentTime: new Date(),
//                 tokenIssued: new Date(JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).iat * 1000),
//                 tokenExpires: new Date(JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).exp * 1000)
//             });
//             throw verifyError;
//         }

//         // 3. Get user from Firestore
//         const userRef = await admin.firestore()
//             .collection('users')
//             .doc(decoded.uid)
//             .get();



//         if (!userRef.exists) {
//             return res.status(401).json({
//                 success: false,
//                 error: 'User not found in database'
//             });
//         }
//         req.user = {
//             uid: decoded.uid,
//             email: decoded.email,
//             role: userRef.data().role || 'user'
//         };

//         next();
//     } catch (error) {
//         console.error('Authentication Error:', error.message);
//         res.status(401).json({
//             success: false,
//             error: 'Not authorized to access this route'
//         });
//     }
// };

// const authorize = (...roles) => {
//     return (req, res, next) => {
//         if (!req.user) {
//             console.error('Authorize middleware called before protect');
//             return res.status(401).json({ success: false, error: 'User not authenticated' });
//         }


//         if (!roles.includes(req.user.role)) {
//             return res.status(403).json({
//                 success: false,
//                 error: `User with role '${req.user.role}' is not authorized`
//             });
//         }

//         next();
//     };
// };


// module.exports = {
//     protect,
//     authorize
// };


const { auth } = require('../config/firebaseConfig');
const ErrorResponse = require('../utils/ErrorResponse');
// const asyncHandler = require('../utils/asyncHandler');
// middlewares/authMiddleware.js
const admin = require('firebase-admin');


const protect = async (req, res, next) => {
    try {
        // 1. Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.log('Authorization header missing');
            return res.status(401).json({ error: 'Authorization token required' });
        }

        // 2. Verify token - wrapped in its own try-catch for better debugging
        let decoded;
        try {
            decoded = await admin.auth().verifyIdToken(token);
            console.log('Token successfully decoded:', {
                uid: decoded.uid,
                email: decoded.email,
                iat: new Date(decoded.iat * 1000),
                exp: new Date(decoded.exp * 1000)
            });
        } catch (verifyError) {
            console.error('Token verification failed:', {
                error: verifyError.code,
                message: verifyError.message
            });
            return res.status(401).json({
                error: 'Invalid token',
                details: verifyError.message
            });
        }

        // 3. Check if decoded exists (should always exist if we got here)
        if (!decoded) {
            console.error('Unexpected error: Token verified but decoded is undefined');
            return res.status(500).json({ error: 'Internal authentication error' });
        }

        // 4. Verify user exists in Firestore
        const userDoc = await admin.firestore()
            .collection('users')
            .doc(decoded.uid)
            .get();

        if (!userDoc.exists) {
            console.log('Creating new user document for:', decoded.email);
            await userDoc.ref.set({
                email: decoded.email,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                lastLogin: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }

        // 5. Attach user to request
        req.user = {
            uid: decoded.uid,
            email: decoded.email,
            role: userDoc.data()?.role || 'user'
        };

        console.log('Authentication successful for:', req.user.email);
        next();

    } catch (error) {
        console.error('Final authentication catch:', {
            error: error.code || 'unknown',
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            error: 'Authentication failed',
            details: error.message
        });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            console.error('Authorize middleware called before protect');
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }


        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `User with role '${req.user.role}' is not authorized`
            });
        }

        next();
    };
};

module.exports = {
    protect,
    authorize
};