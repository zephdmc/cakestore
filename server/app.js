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

// CORS Middleware - MUST BE FIRST
app.use(cors({
  origin: [
    'https://www.stefanosbakeshop.com',
    'https://stefanosbakeshop.com',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
    'X-CSRF-Token'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400 // 24 hours
}));

// Handle preflight requests globally
app.options('*', cors());

// ==================== SECURITY MIDDLEWARE ====================

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://cakestore-8pe7.onrender.com", "https://www.stefanosbakeshop.com"]
    }
  }
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
    'content-type': req.headers['content-type']
  });
  
  // Add CORS headers to every response
  res.header('Access-Control-Allow-Credentials', 'true');
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
    message: 'Server is running with CORS',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    cors: 'enabled'
  });
});

// Test POST endpoint for products
app.post('/api/test-product-create', (req, res) => {
  console.log('Test product creation received:', req.body);
  res.json({ 
    success: true,
    message: 'Product creation endpoint is working!',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// Test CORS endpoint
app.get('/api/cors-test', (req, res) => {
  res.json({ 
    success: true,
    message: 'CORS is working perfectly!',
    yourOrigin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// ==================== ERROR HANDLING ====================

// Error handling middleware
app.use(errorMiddleware);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      '/api/health',
      '/api/cors-test',
      '/api/test-product-create (POST)',
      '/api/products (GET, POST)'
    ]
  });
});

module.exports = app;
