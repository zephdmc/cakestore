const express = require('express');
const {
    getNotifications,
    markNotificationAsRead,
    markAllAsRead
} = require('../controllers/notificationController.js');
const { protect } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/', getNotifications);
router.patch('/:id/read', markNotificationAsRead);
router.patch('/mark-all-read', markAllAsRead);

module.exports = router;