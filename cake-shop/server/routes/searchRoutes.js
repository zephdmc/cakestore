const express = require('express')  // Note the quotes around 'express'
const { searchProducts, getSuggestions } = require('../controllers/searchController.js');

const router = express.Router();

// GET /api/search/suggestions?q=query
router.get('/suggestions', getSuggestions);

// GET /api/search?q=query
router.get('/search', searchProducts);

module.exports = router;