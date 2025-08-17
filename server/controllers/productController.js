const { db } = require('../config/firebaseConfig');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Product = require('../models/Product');
const admin = require('firebase-admin');
// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
    let query = db.collection('products');

    // Filter by category
    if (req.query.category) {
        query = query.where('category', '==', req.query.category);
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
        query = query.where('price', '>=', minPrice).where('price', '<=', maxPrice);
    }

    // Search by name
    if (req.query.search) {
        // Note: Firestore doesn't support full-text search natively
        // This is a simple implementation that would need enhancement
        query = query.where('name', '>=', req.query.search)
            .where('name', '<=', req.query.search + '\uf8ff');
    }

    const snapshot = await query.get();
    const products = [];

    snapshot.forEach(doc => {
        products.push(Product.fromFirestore(doc.id, doc.data()));
    });

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const productRef = await db.collection('products').doc(req.params.id).get();

    if (!productRef.exists) {
        return next(new ErrorResponse('Product not found', 404));
    }

    const product = Product.fromFirestore(productRef.id, productRef.data());

    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {
        console.log('Incoming product data:', req.body);
        console.log('Authenticated user:', req.user);

        // Validate required fields
        const requiredFields = ['name', 'price', 'description'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Create product
        const productRef = await admin.firestore().collection('products').add({
            ...req.body,
            createdBy: req.user.uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        const productDoc = await productRef.get();

        return res.status(201).json({
            success: true,
            message: 'Product created successfully', // ✅ Important
            id: productRef.id,
            data: productDoc.data()
        });

    } catch (error) {
        console.error('Product Creation Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during product creation' // ✅ use `message` key
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
    const productRef = db.collection('products').doc(req.params.id);
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
        return next(new ErrorResponse('Product not found', 404));
    }

    const updates = {
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    await productRef.update(updates);

    const updatedProduct = await productRef.get();

    res.status(200).json({
        success: true,
        message: 'Product updated successfully', // Add explicit message
        data: Product.fromFirestore(updatedProduct.id, updatedProduct.data())
    });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const productRef = db.collection('products').doc(req.params.id);
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
        return next(new ErrorResponse('Product not found', 404));
    }

    await productRef.delete();

    res.status(200).json({
        success: true,
        data: {}
    });
});