// controllers/searchController.js
const { db } = require('../config/firebaseConfig');
const Product = require('../models/Product'); // Your existing Product model

const getSuggestions = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // Search in Firestore
        const productsRef = db.collection('products');
        const snapshot = await productsRef
            .where('name', '>=', q)
            .where('name', '<=', q + '\uf8ff')
            .limit(5)
            .get();

        const suggestions = [];
        snapshot.forEach(doc => {
            suggestions.push(Product.fromFirestore(doc.id, doc.data()));
        });

        res.status(200).json({
            success: true,
            data: suggestions
        });
    } catch (error) {
        console.error('Error in getSuggestions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching suggestions',
            error: error.message
        });
    }
};

const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // Search in Firestore with multiple fields
        const productsRef = db.collection('products');

        // Query for name matches
        const nameSnapshot = await productsRef
            .where('name', '>=', q)
            .where('name', '<=', q + '\uf8ff')
            .get();

        // Query for description matches
        const descSnapshot = await productsRef
            .where('description', '>=', q)
            .where('description', '<=', q + '\uf8ff')
            .get();

        // Query for category matches
        const catSnapshot = await productsRef
            .where('category', '>=', q)
            .where('category', '<=', q + '\uf8ff')
            .get();

        // Combine results and remove duplicates
        const productsMap = new Map();

        [nameSnapshot, descSnapshot, catSnapshot].forEach(snapshot => {
            snapshot.forEach(doc => {
                if (!productsMap.has(doc.id)) {
                    productsMap.set(doc.id, Product.fromFirestore(doc.id, doc.data()));
                }
            });
        });

        const products = Array.from(productsMap.values());

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error in searchProducts:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during search',
            error: error.message
        });
    }
};

module.exports = {
    getSuggestions,
    searchProducts
};