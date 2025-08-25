// server/routes/customOrderRoutes.js
const express = require('express');
const {
    createCustomOrder,
    getMyCustomOrders,
    getAllCustomOrders,
    updateCustomOrderStatus,
    getCustomOrderById
} = require('../controllers/customOrderController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, upload.single('referenceImage'), createCustomOrder)
    .get(protect, authorize('admin'), getAllCustomOrders);

router.route('/my-orders').get(protect, getMyCustomOrders);
router.route('/:id').get(protect, getCustomOrderById);
router.route('/:id/status').put(protect, authorize('admin'), updateCustomOrderStatus);

module.exports = router;
