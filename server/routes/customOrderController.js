// server/controllers/customOrderController.js
const { db, storage } = require('../config/firebaseConfig');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const CustomOrder = require('../models/CustomOrder');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { v4: uuidv4 } = require('uuid');

// @desc    Create custom order
// @route   POST /api/custom-orders
// @access  Private
exports.createCustomOrder = asyncHandler(async (req, res, next) => {
    try {
        const {
            userId,
            userEmail,
            occasion,
            size,
            flavor,
            frosting,
            filling,
            decorations,
            message,
            deliveryDate,
            deliveryTime,
            allergies,
            specialInstructions,
            price
        } = req.body;

        // Validate required fields
        if (!userId) throw new Error('User ID is required');
        if (!userEmail) throw new Error('User email is required');
        if (!occasion) throw new Error('Occasion is required');
        if (!size) throw new Error('Size is required');
        if (!flavor) throw new Error('Flavor is required');
        if (!frosting) throw new Error('Frosting is required');
        if (!decorations) throw new Error('Decorations are required');
        if (!deliveryDate) throw new Error('Delivery date is required');
        if (!price) throw new Error('Price is required');

        let imageUrl = null;

        // Handle image upload if provided
        if (req.files && req.files.referenceImage) {
            const imageFile = req.files.referenceImage;
            const imageRef = ref(storage, `custom-orders/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(imageRef, imageFile.data);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        const customOrderData = {
            userId,
            userEmail,
            occasion,
            size,
            flavor,
            frosting,
            filling: filling || 'none',
            decorations,
            message: message || '',
            deliveryDate,
            deliveryTime: deliveryTime || '',
            allergies: allergies || '',
            specialInstructions: specialInstructions || '',
            imageUrl,
            price: Number(price),
            status: 'pending'
        };

        const customOrder = new CustomOrder(customOrderData);
        const customOrderRef = db.collection('customOrders').doc(customOrder.id);
        
        await customOrderRef.set(customOrder.toFirestore());

        res.status(201).json({
            success: true,
            data: customOrder
        });

    } catch (error) {
        console.error('Custom order creation failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @desc    Get custom orders by user
// @route   GET /api/custom-orders/my-orders
// @access  Private
exports.getMyCustomOrders = asyncHandler(async (req, res, next) => {
    try {
        const snapshot = await db.collection('customOrders')
            .where('userId', '==', req.user.uid)
            .orderBy('createdAt', 'desc')
            .get();

        const orders = [];
        snapshot.forEach(doc => {
            orders.push(CustomOrder.fromFirestore(doc.id, doc.data()));
        });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching custom orders:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @desc    Get all custom orders (Admin)
// @route   GET /api/custom-orders
// @access  Private/Admin
exports.getAllCustomOrders = asyncHandler(async (req, res, next) => {
    try {
        const snapshot = await db.collection('customOrders')
            .orderBy('createdAt', 'desc')
            .get();

        const orders = [];
        snapshot.forEach(doc => {
            orders.push(CustomOrder.fromFirestore(doc.id, doc.data()));
        });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching all custom orders:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @desc    Update custom order status
// @route   PUT /api/custom-orders/:id/status
// @access  Private/Admin
exports.updateCustomOrderStatus = asyncHandler(async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'in-progress', 'ready', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        const orderRef = db.collection('customOrders').doc(req.params.id);
        const orderSnap = await orderRef.get();

        if (!orderSnap.exists) {
            return res.status(404).json({
                success: false,
                error: 'Custom order not found'
            });
        }

        await orderRef.update({
            status,
            updatedAt: new Date().toISOString()
        });

        res.status(200).json({
            success: true,
            data: { id: req.params.id, status }
        });
    } catch (error) {
        console.error('Error updating custom order status:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @desc    Get custom order by ID
// @route   GET /api/custom-orders/:id
// @access  Private
exports.getCustomOrderById = asyncHandler(async (req, res, next) => {
    try {
        const orderRef = await db.collection('customOrders').doc(req.params.id).get();

        if (!orderRef.exists) {
            return res.status(404).json({
                success: false,
                error: 'Custom order not found'
            });
        }

        const order = CustomOrder.fromFirestore(orderRef.id, orderRef.data());

        // Verify ownership or admin status
        if (order.userId !== req.user.uid && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching custom order:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
