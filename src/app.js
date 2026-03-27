import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/authRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

// Import middleware
import { errorHandler, notFound } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting for public endpoints
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  }
});

// Rate limiting for auth endpoints (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.'
  }
});

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/pages', publicLimiter, pageRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/contact', publicLimiter, contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Care-Ed API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;