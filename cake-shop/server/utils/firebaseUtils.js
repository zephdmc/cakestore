const { auth } = require('../config/firebaseConfig');
const jwt = require('jsonwebtoken');

// Generate JWT token
exports.generateToken = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        const options = {
            expiresIn: process.env.JWT_EXPIRE
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            options,
            (err, token) => {
                if (err) {
                    console.error(err);
                    reject('Could not generate token');
                } else {
                    resolve(token);
                }
            }
        );
    });
};

// Verify Firebase token
exports.verifyFirebaseToken = async (token) => {
    try {
        const decodedToken = await auth.verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error('Error verifying token:', error);
        throw new Error('Invalid or expired token');
    }
};