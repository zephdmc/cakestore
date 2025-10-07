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

// ==================== CORS FIX - WORKING WITH CREDENTIALS ====================

app.use((req, res, next) => {
  const allowedOrigins = [
    'https://www.stefanosbakeshop.com',
    'https://stefanosbakeshop.com',
    'http://localhost:3000',
    'http://localhost:5173'
  ];
  
  const origin = req.headers.origin;
  
  // Allow credentials only for specific origins
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  } else {
    // For other origins, don't allow credentials
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'false');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.header('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// ==================== SECURITY MIDDLEWARE ====================

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

// Rate limiting
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

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
    origin: req.headers.origin,
    'user-agent': req.headers['user-agent'],
    'content-type': req.headers['content-type'],
    'content-length': req.headers['content-length'],
    'authorization': req.headers['authorization'] ? 'Present' : 'Missing'
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
    message: 'Server is running with CORS + Credentials',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    credentials: 'enabled-for-your-domain'
  });
});

// Test POST endpoint for products
app.post('/api/test-product-create', (req, res) => {
  console.log('Test product creation received:', req.body);
  res.json({ 
    success: true,
    message: 'Product creation endpoint is working!',
    receivedData: req.body,
    timestamp: new Date().toISOString(),
    headers: {
      authorization: req.headers.authorization ? 'Present' : 'Missing'
    }
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
    message: 'CORS is working perfectly with credentials!',
    yourOrigin: req.headers.origin,
    timestamp: new Date().toISOString(),
    method: 'GET'
  });
});

// Test CORS with POST
app.post('/api/cors-test', (req, res) => {
  res.json({ 
    success: true,
    message: 'CORS is working with POST + credentials!',
    yourOrigin: req.headers.origin,
    receivedData: req.body,
    timestamp: new Date().toISOString(),
    method: 'POST'
  });
});

// ==================== ERROR HANDLING ====================

app.use(errorMiddleware);

// Global error handler with CORS headers
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  
  const origin = req.headers.origin;
  const allowedOrigins = ['https://www.stefanosbakeshop.com', 'https://stefanosbakeshop.com'];
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  } else {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'false');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler with CORS headers
app.use('*', (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = ['https://www.stefanosbakeshop.com', 'https://stefanosbakeshop.com'];
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  } else {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'false');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  
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
