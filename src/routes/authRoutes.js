import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import authController from '../controllers/authController.js';
import { protect, superAdminOnly } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

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

// Public routes
router.post('/login', loginValidation, validate, authController.login);

// Protected routes
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, updateProfileValidation, validate, authController.updateProfile);
router.put('/password', protect, changePasswordValidation, validate, authController.changePassword);
router.post('/logout', protect, authController.logout);
router.get('/verify', protect, authController.verifyToken);

export default router;