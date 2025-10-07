const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const searchRoutes = require('./routes/searchRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const users = require('./routes/userRoutes');
const payments = require('./routes/paymentroute');
const customOrderRoutes = require('./routes/customOrderRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// ==================== CORS FIX - GUARANTEED WORKING ====================

// OPTION 1: Simple & Effective CORS
app.use(cors({
  origin: [
    'https://www.stefanosbakeshop.com',
    'https://stefanosbakeshop.com',
    'http://localhost:3000' // for development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  optionsSuccessStatus: 200
}));

// OPTION 2: Manual CORS as backup (uncomment if Option 1 doesn't work)
/*
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://www.stefanosbakeshop.com',
    'https://stefanosbakeshop.com',
    'http://localhost:3000'
  ];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});
*/

// ==================== SECURITY MIDDLEWARE ====================

// Security headers - CORS compatible
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://cakestore-8pe7.onrender.com", "https://www.stefanosbakeshop.com"]
    }
  }
}));

// Rate limiting - temporarily increased for testing
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // Increased for testing
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10mb' })); // Increased limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Data sanitization
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// ==================== ROUTES ====================

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', users);
app.use('/api/payments', payments);
app.use('/api/custom-orders', customOrderRoutes);

// ==================== TEST ENDPOINTS ====================

// Health check with detailed CORS info
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running with CORS enabled',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    cors: {
      enabled: true,
      allowedOrigins: ['https://www.stefanosbakeshop.com', 'https://stefanosbakeshop.com'],
      credentials: true
    }
  });
});

// CORS test endpoint
app.get('/api/test-cors', (req, res) => {
  res.json({ 
    success: true,
    message: 'CORS is working perfectly!',
    yourOrigin: req.headers.origin,
    timestamp: new Date().toISOString(),
    headers: {
      origin: req.headers.origin,
      'access-control-request-method': req.headers['access-control-request-method'],
      'access-control-request-headers': req.headers['access-control-request-headers']
    }
  });
});

// Test products endpoint
app.get('/api/test-products', (req, res) => {
  res.json({
    success: true,
    products: [
      { id: 1, name: 'Test Chocolate Cake', price: 29.99, inStock: true },
      { id: 2, name: 'Test Vanilla Cake', price: 24.99, inStock: true }
    ],
    message: 'Products endpoint is working with CORS'
  });
});

// Test orders endpoint
app.get('/api/test-orders', (req, res) => {
  res.json({
    success: true,
    orders: [
      { id: 1, status: 'pending', total: 29.99 },
      { id: 2, status: 'completed', total: 45.50 }
    ],
    message: 'Orders endpoint is working with CORS'
  });
});

// Pre-flight test endpoint
app.options('/api/test-preflight', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).send();
});

// ==================== ERROR HANDLING ====================

// Error handling middleware
app.use(errorMiddleware);

// 404 handler with CORS headers
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      '/api/health',
      '/api/test-cors',
      '/api/test-products',
      '/api/test-orders',
      '/api/auth/*',
      '/api/products/*',
      '/api/orders/*'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
