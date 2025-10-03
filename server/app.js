const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const { db } = require('./config/firebaseConfig'); // Make sure this path is correct
// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const searchRoutes = require('./routes/searchRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const users = require('./routes/userRoutes')
const payments = require('./routes/paymentroute');
const customOrderRoutes = require('./routes/customOrderRoutes');

// const adminRoutes = require('./routes/adminRoutes');
// Import error middleware
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// Set security HTTP headers
app.use(helmet());
console.log(process.env.FRONTEND_URL)
// Enable CORS
const allowedOrigins = [
  'https://stefanosbakeshop.com', 
  'https://cakestore-git-main-stefanos-projects-ea9eedaa.vercel.app
  'https://bellebeauaesthetics.ng',
  'https://www.bellebeauaesthetics.ng'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  methods: ['POST', 'GET', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', notificationRoutes);
app.use('/api/admin', users);
app.use('/api/payments', payments);
app.use('/api/custom-orders', customOrderRoutes);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
