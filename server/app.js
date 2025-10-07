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

// ==================== NUCLEAR CORS OPTION ====================

// Remove all CORS restrictions temporarily - MUST BE FIRST
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// ==================== SECURITY MIDDLEWARE ====================

// Security headers (adjusted for nuclear CORS)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false // Temporarily disable for testing
}));

// Rate limiting - temporarily relaxed
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

// Body parser with increased limits for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Data sanitization
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// ==================== REQUEST LOGGING MIDDLEWARE ====================

// Add request logging to debug CORS issues
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
    origin: req.headers.origin,
    'user-agent': req.headers['user-agent'],
    'content-type': req.headers['content-type'],
    'content-length': req.headers['content-length']
  });
  next();
});

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running with NUCLEAR CORS',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    cors: 'nuclear-enabled'
  });
});

// Test POST endpoint for products
app.post('/api/test-product-create', (req, res) => {
  console.log('Test product creation received:', req.body);
  res.json({ 
    success: true,
    message: 'Product creation endpoint is working with nuclear CORS!',
    receivedData: req.body,
    timestamp: new Date().toISOString(),
    headers: req.headers
  });
});

// Test actual product creation
app.post('/api/products/test', (req, res) => {
  console.log('Actual products endpoint test:', req.body);
  res.json({ 
    success: true,
    message: 'Actual products endpoint is working!',
    data: req.body,
    timestamp: new Date().toISOString()
  });
});

// Test CORS endpoint
app.get('/api/cors-test', (req, res) => {
  res.json({ 
    success: true,
    message: 'NUCLEAR CORS is working perfectly!',
    yourOrigin: req.headers.origin,
    timestamp: new Date().toISOString(),
    method: 'GET'
  });
});

// Test CORS with POST
app.post('/api/cors-test', (req, res) => {
  res.json({ 
    success: true,
    message: 'NUCLEAR CORS is working with POST!',
    yourOrigin: req.headers.origin,
    receivedData: req.body,
    timestamp: new Date().toISOString(),
    method: 'POST'
  });
});

// ==================== ERROR HANDLING ====================

// Error handling middleware
app.use(errorMiddleware);

// Global error handler with CORS headers
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  
  // Ensure CORS headers are set even on errors
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', '*');
  
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler with CORS headers
app.use('*', (req, res) => {
  // Ensure CORS headers are set for 404 responses
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', '*');
  
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      '/api/health',
      '/api/cors-test (GET, POST)',
      '/api/test-product-create (POST)',
      '/api/products/test (POST)',
      '/api/products (GET, POST)'
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
