const admin = require('../config/firebaseConfig');

async function setAdminRole(email) {
    try {
        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().setCustomUserClaims(user.uid, { admin: true });
        return { success: true, message: `${email} is now an admin` };
    } catch (error) {
        throw new Error(`Error setting admin role: ${error.message}`);
    }
}

async function verifyAdmin(uid) {
    const user = await admin.auth().getUser(uid);
    return !!user.customClaims?.admin;
}

exports.removeAdminRole = async (email) => {
    try {
        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().setCustomUserClaims(user.uid, { admin: false });
        await admin.auth().revokeRefreshTokens(user.uid);
        return { success: true, message: `${email} admin privileges removed` };
    } catch (error) {
        throw new Error('Failed to remove admin role');
    }
};

module.exports = { setAdminRole, verifyAdmin };