const { db } = require('../config/firebaseConfig');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Order = require('../models/Order');
const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');

// @desc    Create new order
// @route   POST /api/orders
// @access  Privat
exports.createOrder = asyncHandler(async (req, res, next) => {
    try {
        console.log('Raw request body:', JSON.stringify(req.body, null, 2));

        const {
            userId,
            items,
            shippingAddress,
            paymentMethod,
            paymentResult,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        } = req.body;

        // Enhanced validation with detailed errors
        if (!userId) throw new Error('User ID is required');
        if (!items || items.length === 0) throw new Error('No order items provided');
        if (!shippingAddress) throw new Error('Shipping address is required');
        if (!paymentMethod) throw new Error('Payment method is required');
        if (!paymentResult?.id) throw new Error('Payment verification is required');

        // Validate each item
        items.forEach(item => {
            if (!item.productId) throw new Error(`Item missing productId: ${JSON.stringify(item)}`);
            if (!item.quantity) throw new Error(`Item missing quantity: ${JSON.stringify(item)}`);
        });

        // Convert and validate numeric fields
        const numericItems = items.map(item => {
            const price = Number(item.price);
            const quantity = Number(item.quantity);

            if (isNaN(price)) throw new Error(`Invalid price for item ${item.productId}`);
            if (isNaN(quantity)) throw new Error(`Invalid quantity for item ${item.productId}`);

            return {
                ...item,
                price,
                quantity
            };
        });


 // In server/controllers/orderController.js, modify the createOrder function
// Add this validation after the existing validations
if (req.body.isCustomOrder && req.body.customOrderId) {
    // Verify custom order exists and belongs to user
    const customOrderRef = await db.collection('customOrders').doc(req.body.customOrderId).get();
    if (!customOrderRef.exists) {
        throw new Error('Custom order not found');
    }
    
    const customOrder = customOrderRef.data();
    if (customOrder.userId !== userId) {
        throw new Error('Custom order does not belong to user');
    }
    
    // Update custom order status to confirmed
    await db.collection('customOrders').doc(req.body.customOrderId).update({
        status: 'confirmed',
        updatedAt: new Date().toISOString()
    });
}


        
        const numericPrices = {
            itemsPrice: validateNumber(itemsPrice, 'itemsPrice'),
            shippingPrice: validateNumber(shippingPrice, 'shippingPrice'),
            taxPrice: validateNumber(taxPrice, 'taxPrice'),
            totalPrice: validateNumber(totalPrice, 'totalPrice')
        };

        function validateNumber(value, fieldName) {
            const num = Number(value);
            if (isNaN(num)) throw new Error(`Invalid ${fieldName}: ${value}`);
            return num;
        }

        const orderId = `order_${uuidv4().replace(/-/g, '').slice(0, 12)}`;

        const orderData = {
            id: orderId,
            userId,
            items: numericItems,
            shippingAddress,
            paymentMethod,
            paymentResult: {
                ...paymentResult,
                amount: validateNumber(paymentResult.amount, 'payment amount')
            },
            ...numericPrices,
            isPaid: true,
            paidAt: paymentResult.verifiedAt || new Date().toISOString(),
            isDelivered: false,
            deliveredAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        console.log('Processed order data:', JSON.stringify(orderData, null, 2));

        // Firestore transaction with detailed error handling
        await db.runTransaction(async (transaction) => {
            try {
                // Step 1: Prepare references
                const orderRef = db.collection('orders').doc(orderId);
                const userRef = db.collection('users').doc(userId);
                const productRefs = numericItems.map(item =>
                    db.collection('products').doc(item.productId)
                );

                // Step 2: Perform all reads first
                const userDoc = await transaction.get(userRef);
                if (!userDoc.exists) {
                    throw new Error(`User not found: ${userId}`);
                }

                const productDocs = await Promise.all(productRefs.map(ref => transaction.get(ref)));

                // Step 3: Validate product stock
                productDocs.forEach((doc, index) => {
                    const item = numericItems[index];
                    if (!doc.exists) {
                        throw new Error(`Product not found: ${item.productId}`);
                    }
                    const currentStock = doc.data().countInStock || 0;
                    if (currentStock < item.quantity) {
                        throw new Error(`Insufficient stock for product ${item.productId}. Available: ${currentStock}, Requested: ${item.quantity}`);
                    }
                });

                // Step 4: All writes come after reads
                transaction.set(orderRef, orderData);

                transaction.update(userRef, {
                    orders: admin.firestore.FieldValue.arrayUnion(orderId),
                    updatedAt: new Date().toISOString()
                });

                productRefs.forEach((ref, index) => {
                    const item = numericItems[index];
                    transaction.update(ref, {
                        countInStock: admin.firestore.FieldValue.increment(-item.quantity),
                        updatedAt: new Date().toISOString()
                    });
                });

            } catch (transactionError) {
                console.error('Transaction error details:', {
                    message: transactionError.message,
                    stack: transactionError.stack,
                    items: numericItems.map(i => ({
                        productId: i.productId,
                        quantity: i.quantity
                    }))
                });
                throw transactionError;
            }
        });


        // Email sending (non-blocking)
        // Email sending (non-blocking but with better error handling)
        try {
            await sendEmail({
                email: shippingAddress.email,
                subject: `Your Bellebeau Auaesthetics Order #${orderId}`,
                template: 'order-confirmation',
                context: {
                    orderId,
                    totalPrice,
                    items: numericItems,
                    shippingAddress
                }
            });
            console.log('Order confirmation email sent successfully');
        } catch (emailError) {
            console.error('Email sending failed:', {
                error: emailError.message,
                stack: emailError.stack,
                recipient: shippingAddress.email
            });
            // Consider adding this to your order data or error reporting system
        }

        res.status(201).json({
            success: true,
            data: orderData
        });

    } catch (error) {
        console.error('Complete order creation failure:', {
            timestamp: new Date().toISOString(),
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                requestBody: req.body
            }
        });

        res.status(500).json({
            success: false,
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? {
                stack: error.stack,
                validationErrors: error.errors
            } : undefined
        });
    }
});
// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res, next) => {
    const orderRef = await db.collection('orders').doc(req.params.id).get();

    if (!orderRef.exists) {
        return next(new ErrorResponse('Order not found', 404));
    }

    const order = orderRef.data();

    // Verify ownership or admin status
    if (order.userId !== req.user.uid && req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to access this order', 401));
    }

    res.status(200).json({
        success: true,
        data: order
    });
});


// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const orderRef = db.collection('orders').doc(req.params.id);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
        return next(new ErrorResponse('Order not found', 404));
    }

    const order = Order.fromFirestore(orderSnap.id, orderSnap.data());

    if (order.userId !== req.user.uid && req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to update this order', 401));
    }

    await orderRef.update({
        isPaid: true,
        paidAt: new Date().toISOString(),
        paymentResult: {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        }
    });

    res.status(200).json({
        success: true,
        data: { id: req.params.id }
    });
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const orderRef = db.collection('orders').doc(req.params.id);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
        return next(new ErrorResponse('Order not found', 404));
    }

    await orderRef.update({
        isDelivered: true,
        deliveredAt: new Date().toISOString()
    });

    res.status(200).json({
        success: true,
        data: { id: req.params.id }
    });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
    const snapshot = await db.collection('orders')
        .where('userId', '==', req.user.uid)
        .get();

    const orders = [];
    snapshot.forEach(doc => {
        orders.push(Order.fromFirestore(doc.id, doc.data()));
    });

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req, res, next) => {
    const snapshot = await db.collection('orders').get();
    const orders = [];

    snapshot.forEach(doc => {
        orders.push(Order.fromFirestore(doc.id, doc.data()));
    });

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});
