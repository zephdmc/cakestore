const express = require('express');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductCounts,
    getFilterOptions  // Added new controller function
} = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/stats/counts', getProductCounts);
router.get('/filters/options', getFilterOptions);
router.get('/:id', getProduct);

// Protected admin routes
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
