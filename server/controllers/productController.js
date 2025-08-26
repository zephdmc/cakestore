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
exports.getProducts = asyncHandler(async (req, res, next) => {
    let query = db.collection('products');

    // ... existing filters (category, price, search) ...

    // NEW FILTER: Filter by dietary tag (e.g., ?dietary=Gluten-Free)
    if (req.query.dietary) {
        query = query.where('dietaryTags', 'array-contains', req.query.dietary);
    }

    // NEW FILTER: Filter by flavor tag (e.g., ?flavor=Chocolate)
    if (req.query.flavor) {
        query = query.where('flavorTags', 'array-contains', req.query.flavor);
    }

    // NEW FILTER: Show only custom or only non-custom products (e.g., ?custom=true)
    if (req.query.custom !== undefined) {
        // Convert the string 'true'/'false' to a boolean
        const isCustom = req.query.custom === 'true';
        query = query.where('isCustom', '==', isCustom);
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
        // This applies defaults and structures the data correctly (e.g., ensures arrays)
        const newProduct = new Product(req.body);

        // 2. Get the Firestore-ready object from the model
        const productData = newProduct.toFirestore();

        // 3. Add metadata fields for Firestore
        const productRef = await admin.firestore().collection('products').add({
            ...productData, // Use the model's data, not raw req.body
            createdBy: req.user.uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        const productDoc = await productRef.get();

        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            id: productRef.id,
            data: { id: productRef.id, ...productDoc.data() } // Include the ID in the response
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
    // This is useful if a form sends a comma-separated string like "gluten-free,vegan"
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
