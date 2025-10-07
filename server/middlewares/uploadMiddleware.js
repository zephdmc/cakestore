// middlewares/uploadMiddleware.js - SIMPLE VERSION
const multer = require('multer');

// Simple memory storage
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

module.exports = upload;
