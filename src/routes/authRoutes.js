import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import authController from '../controllers/authController.js';
import { protect, superAdminOnly } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

// Rate limiters - configured for cloud hosting (Render, Heroku, etc.)
// These use X-Forwarded-For header to get real client IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // increased for shared IPs (offices, ISPs, proxies)
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use real IP from proxy headers or fallback to socket IP
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress;
  },
  message: {
    success: false,
    error: 'Too many login attempts, please try again later.'
  }
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // generous for admin panel usage
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress;
  },
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  }
});

// Validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
];

// Public routes (with strict rate limiting for login)
router.post('/login', loginLimiter, loginValidation, validate, authController.login);

// Protected routes (with generous rate limiting for admin panel)
router.get('/me', adminLimiter, protect, authController.getMe);
router.put('/profile', adminLimiter, protect, updateProfileValidation, validate, authController.updateProfile);
router.put('/password', adminLimiter, protect, changePasswordValidation, validate, authController.changePassword);
router.post('/logout', adminLimiter, protect, authController.logout);
router.get('/verify', adminLimiter, protect, authController.verifyToken);

export default router;