const express = require('express');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getProducts)                    // Public access to browse mugs
    .post(protect, authorize('admin'), createProduct); // Admin only - add new mugs

router.route('/:id')
    .get(getProduct)                     // Public access to view specific mug
    .put(protect, authorize('admin'), updateProduct)   // Admin only - update mug details
    .delete(protect, authorize('admin'), deleteProduct); // Admin only - remove mugs

module.exports = router;
