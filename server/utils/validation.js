const { body, validationResult } = require('express-validator');

// Validation rules for user registration
exports.validateRegister = [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body(
        'password',
        'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
];

// Validation rules for user login
exports.validateLogin = [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
];

// Validation rules for product creation
exports.validateProduct = [
    body('name', 'Name is required').not().isEmpty(),
    body('price', 'Price must be a positive number').isFloat({ gt: 0 }),
    body('description', 'Description is required').not().isEmpty(),
    body('category', 'Category is required').not().isEmpty(),
    body('countInStock', 'Count in stock must be a positive integer').isInt({ gt: -1 })
];

// Middleware to handle validation errors
exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};