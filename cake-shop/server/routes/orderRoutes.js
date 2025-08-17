const express = require('express');
const {
    createOrder,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders
} = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/')
    .post(protect, createOrder)
    .get(protect, authorize('admin'), getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, authorize('admin'), updateOrderToDelivered);

module.exports = router;