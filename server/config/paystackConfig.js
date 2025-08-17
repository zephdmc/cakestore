const paystack = (request) => {
    const initializePayment = (form, callback) => {
        const options = {
            url: 'https://api.paystack.co/transaction/initialize',
            headers: {
                authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            },
            form
        };

        const callbackFn = (error, response, body) => {
            if (error) return callback(error, null);
            return callback(null, body);
        };

        request.post(options, callbackFn);
    };

    const verifyPayment = (ref, callback) => {
        const options = {
            url: `https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`,
            headers: {
                authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            }
        };

        const callbackFn = (error, response, body) => {
            if (error) return callback(error, null);
            return callback(null, body);
        };

        request.get(options, callbackFn);
    };

    return { initializePayment, verifyPayment };
};

module.exports = paystack;