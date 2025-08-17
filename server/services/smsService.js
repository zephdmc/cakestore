const axios = require('axios');
const ErrorResponse = require('../utils/ErrorResponse');

exports.sendSMS = async ({ phone, message }) => {
    try {
        if (!phone || !message) {
            throw new ErrorResponse('Phone number and message are required', 400);
        }

        const response = await axios.post('https://api.termii.com/api/sms/send', {
            to: phone,
            from: process.env.TERMII_SENDER_ID,
            sms: message,
            type: 'plain',
            channel: 'generic',
            api_key: process.env.TERMII_API_KEY
        });

        return response.data;
    } catch (err) {
        console.error('SMS sending failed:', err.message);
        throw err;
    }
};