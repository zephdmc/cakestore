const { db } = require('../config/firebaseConfig');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Product = require('../models/Product');
const admin = require('firebase-admin');

// Product type validation helpers
const validateProductData = (productType, data) => {
    const errors = [];
    
    // Common required fields for all products
    if (!data.name) errors.push('Product name is required');
    if (!data.price || data.price <= 0) errors.push('Valid price is required');
    if (!data.description) errors.push('Description is required');
    if (!data.images || data.images.length === 0) errors.push('At least one image is required');
    
    // Type-specific validations
    switch (productType) {
        case 'cake':
            if (!data.ingredients || data.ingredients.length === 0) {
                errors.push('Ingredients are required for cakes');
            }
            if (!data.size) errors.push('Size is required for cakes');
            break;
            
        case 'candle':
            if (!data.scent) errors.push('Scent is required for candles');
            if (!data.burnTime) errors.push('Burn time is required for candles');
            if (!data.waxType) errors.push('Wax type is required for candles');
            break;
            
        case 'mug':
            if (!data.capacity) errors.push('Capacity is required for mugs');
            if (!data.material) errors.push('Material is required for mugs');
            if (!data.designType) errors.push('Design type is required for mugs');
            break;
            
        default:
            errors.push('Valid product type is required (cake, candle, or mug)');
    }
    
    return errors;
};

// Format product data based on type
const formatProductData = (data) => {
    const formatted = { ...data };
    
    // Ensure arrays are properly formatted
    const arrayFields = ['images', 'ingredients', 'dietaryTags', 'flavorTags'];
    arrayFields.forEach(field => {
        if (formatted[field] && typeof formatted[field] === 'string') {
            formatted[field] = formatted[field].split(',').map(item => item.trim());
        }
    });
    
    return formatted;
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
    let query = db.collection('products');

    // Filter by product type (cake, candle, mug)
    if (req.query.productType) {
        query = query.where('productType', '==', req.query.productType);
    }

    // Filter by category (sub-category within type)
    if (req.query.category) {
        query = query.where('category', '==', req.query.category);
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
        query = query.where('price', '>=', minPrice).where('price', '<=', maxPrice);
    }

    // Type-specific filters
    if (req.query.productType === 'cake') {
        // Cake-specific filters
        if (req.query.dietary) {
            query = query.where('dietaryTags', 'array-contains', req.query.dietary);
        }
        if (req.query.flavor) {
            query = query.where('flavorTags', 'array-contains', req.query.flavor);
        }
        if (req.query.custom !== undefined) {
            const isCustom = req.query.custom === 'true';
            query = query.where('isCustom', '==', isCustom);
        }
        if (req.query.size) {
            query = query.where('size', '==', req.query.size);
        }
    }
    
    if (req.query.productType === 'candle') {
        // Candle-specific filters
        if (req.query.scent) {
            query = query.where('scent', '==', req.query.scent);
        }
        if (req.query.waxType) {
            query = query.where('waxType', '==', req.query.waxType);
        }
        if (req.query.burnTimeMin) {
            const burnTimeMin = parseInt(req.query.burnTimeMin);
            query = query.where('burnTime', '>=', burnTimeMin);
        }
    }
    
    if (req.query.productType === 'mug') {
        // Mug-specific filters
        if (req.query.material) {
            query = query.where('material', '==', req.query.material);
        }
        if (req.query.designType) {
            query = query.where('designType', '==', req.query.designType);
        }
        if (req.query.capacity) {
            query = query.where('capacity', '==', req.query.capacity);
        }
        if (req.query.dishwasherSafe !== undefined) {
            const isDishwasherSafe = req.query.dishwasherSafe === 'true';
            query = query.where('isDishwasherSafe', '==', isDishwasherSafe);
        }
    }
    
    // Search by name (across all product types)
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
exports.getProduct = asyncHandler(async (req, res, next) => {
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
exports.createProduct = asyncHandler(async (req, res, next) => {
    try {
        console.log('Incoming product data:', req.body);

        // Format data before validation
        const formattedData = formatProductData(req.body);
        
        // Validate product type
        if (!formattedData.productType) {
            return next(new ErrorResponse('Product type is required (cake, candle, or mug)', 400));
        }

        // Validate product data based on type
        const validationErrors = validateProductData(formattedData.productType, formattedData);
        if (validationErrors.length > 0) {
            return next(new ErrorResponse(validationErrors.join(', '), 400));
        }

        // Create a new Product instance
        const newProduct = new Product(formattedData);

        // Get Firestore-ready object
        const productData = newProduct.toFirestore();

        // Add to Firestore with metadata
        const productRef = await db.collection('products').add({
            ...productData,
            createdBy: req.user?.uid || 'system',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        const productDoc = await productRef.get();

        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: Product.fromFirestore(productRef.id, productDoc.data())
        });

    } catch (error) {
        console.error('Product Creation Error:', error);
        return next(new ErrorResponse(error.message, 500));
    }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
    const productId = req.params.id;
    const productRef = db.collection('products').doc(productId);
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
        return next(new ErrorResponse('Product not found', 404));
    }

    const existingProduct = Product.fromFirestore(productSnap.id, productSnap.data());
    
    // Format the update data
    const formattedData = formatProductData(req.body);
    
    // Prevent changing product type after creation
    if (formattedData.productType && formattedData.productType !== existingProduct.productType) {
        return next(new ErrorResponse('Cannot change product type after creation', 400));
    }

    // Validate updates based on product type
    if (Object.keys(formattedData).length > 0) {
        const validationErrors = validateProductData(existingProduct.productType, formattedData);
        if (validationErrors.length > 0) {
            return next(new ErrorResponse(validationErrors.join(', '), 400));
        }
    }

    // Prepare updates with server timestamp
    const updates = {
        ...formattedData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await productRef.update(updates);
    
    // Get updated product
    const updatedSnap = await productRef.get();
    const updatedProduct = Product.fromFirestore(updatedSnap.id, updatedSnap.data());

    res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
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
        message: 'Product deleted successfully'
    });
});

// @desc    Get product counts by type
// @route   GET /api/products/stats/counts
// @access  Public
exports.getProductCounts = asyncHandler(async (req, res, next) => {
    const cakesQuery = db.collection('products').where('productType', '==', 'cake');
    const candlesQuery = db.collection('products').where('productType', '==', 'candle');
    const mugsQuery = db.collection('products').where('productType', '==', 'mug');

    const [cakesSnapshot, candlesSnapshot, mugsSnapshot] = await Promise.all([
        cakesQuery.get(),
        candlesQuery.get(),
        mugsQuery.get()
    ]);

    res.status(200).json({
        success: true,
        data: {
            cakes: cakesSnapshot.size,
            candles: candlesSnapshot.size,
            mugs: mugsSnapshot.size,
            total: cakesSnapshot.size + candlesSnapshot.size + mugsSnapshot.size
        }
    });
});

// @desc    Get unique values for filtering
// @route   GET /api/products/filters/options
// @access  Public
exports.getFilterOptions = asyncHandler(async (req, res, next) => {
    const { productType } = req.query;
    
    if (!productType) {
        return next(new ErrorResponse('Product type is required', 400));
    }

    let query = db.collection('products').where('productType', '==', productType);
    const snapshot = await query.get();
    
    const options = {
        categories: new Set(),
        priceRange: { min: Infinity, max: 0 }
    };

    // Add type-specific options
    switch (productType) {
        case 'cake':
            options.dietaryTags = new Set();
            options.flavorTags = new Set();
            options.sizes = new Set();
            break;
        case 'candle':
            options.scents = new Set();
            options.waxTypes = new Set();
            options.burnTimes = new Set();
            break;
        case 'mug':
            options.materials = new Set();
            options.designTypes = new Set();
            options.capacities = new Set();
            break;
    }

    snapshot.forEach(doc => {
        const data = doc.data();
        
        // Common fields
        if (data.category) options.categories.add(data.category);
        if (data.price) {
            options.priceRange.min = Math.min(options.priceRange.min, data.price);
            options.priceRange.max = Math.max(options.priceRange.max, data.price);
        }

        // Type-specific fields
        switch (productType) {
            case 'cake':
                if (data.dietaryTags) {
                    data.dietaryTags.forEach(tag => options.dietaryTags.add(tag));
                }
                if (data.flavorTags) {
                    data.flavorTags.forEach(tag => options.flavorTags.add(tag));
                }
                if (data.size) options.sizes.add(data.size);
                break;
                
            case 'candle':
                if (data.scent) options.scents.add(data.scent);
                if (data.waxType) options.waxTypes.add(data.waxType);
                if (data.burnTime) options.burnTimes.add(data.burnTime);
                break;
                
            case 'mug':
                if (data.material) options.materials.add(data.material);
                if (data.designType) options.designTypes.add(data.designType);
                if (data.capacity) options.capacities.add(data.capacity);
                break;
        }
    });

    // Convert Sets to Arrays
    const result = {};
    for (const [key, value] of Object.entries(options)) {
        if (value instanceof Set) {
            result[key] = Array.from(value);
        } else {
            result[key] = value;
        }
    }

    res.status(200).json({
        success: true,
        data: result
    });
});
