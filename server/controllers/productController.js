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

    // Filter by dietary
    if (req.query.dietary) {
        query = query.where('dietaryTags', 'array-contains', req.query.dietary);
    }

    // Filter by flavor
    if (req.query.flavor) {
        query = query.where('flavorTags', 'array-contains', req.query.flavor);
    }

    // Filter by custom
    if (req.query.custom !== undefined) {
        const isCustom = req.query.custom === 'true';
        query = query.where('isCustom', '==', isCustom);
    }
    
    // Search by name
    if (req.query.search) {
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
exports.getProduct = asyncHandler(async (req, res, next) => { // ← FIXED: Changed to getProduct
    const productId = req.params.id;
    const productRef = db.collection('products').doc(productId);
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
        return next(new ErrorResponse('Product not found', 404));
    }

    const product = Product.fromFirestore(productSnap.id, productSnap.data());

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

        // Validate required fields
        const requiredFields = ['name', 'price', 'description'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // 1. Create a new Product instance from the request body
        const newProduct = new Product(req.body);

        // 2. Get the Firestore-ready object from the model
        const productData = newProduct.toFirestore();

        // 3. Add metadata fields for Firestore
        const productRef = await admin.firestore().collection('products').add({
            ...productData,
            createdBy: req.user?.uid || 'system',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        const productDoc = await productRef.get();

        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            id: productRef.id,
            data: { id: productRef.id, ...productDoc.data() }
        });

    } catch (error) {
        console.error('Product Creation Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during product creation'
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

    // Prepare the update object
    let updates = { ...req.body };

    // Helper function to convert string to array if needed
    const formatArrayField = (field) => {
        if (updates[field] && typeof updates[field] === 'string') {
            updates[field] = updates[field].split(',').map(item => item.trim());
        }
    };

    // Apply formatting to all array-based fields
    formatArrayField('images');
    formatArrayField('ingredients');
    formatArrayField('dietaryTags');
    formatArrayField('flavorTags');

    // Use serverTimestamp for accuracy
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await productRef.update(updates);

    const updatedProduct = await productRef.get();

    res.status(200).json({
        success: true,
        message: 'Product updated successfully',
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
