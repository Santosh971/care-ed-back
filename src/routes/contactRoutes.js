import { Router } from 'express';
import { body, param, query } from 'express-validator';
import contactController from '../controllers/contactController.js';
import { protect, superAdminOnly, editorOrAbove } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

// Validation rules
const submitContactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone cannot exceed 20 characters'),
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subject cannot exceed 200 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 5000 })
    .withMessage('Message cannot exceed 5000 characters'),
  body('inquiryType')
    .optional()
    .isIn(['general', 'programs', 'services', 'careers', 'partnership', 'other'])
    .withMessage('Invalid inquiry type')
];

const updateStatusValidation = [
  body('status')
    .isIn(['new', 'read', 'responded', 'closed'])
    .withMessage('Invalid status')
];

const addNoteValidation = [
  body('note')
    .trim()
    .notEmpty()
    .withMessage('Note cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Note cannot exceed 1000 characters')
];

// Public routes
router.post('/', submitContactValidation, validate, contactController.submitContact);

// Protected routes
router.get('/', protect, contactController.getContacts);
router.get('/stats', protect, contactController.getStats);
router.get('/:id', protect, contactController.getContact);
router.put('/:id/status', protect, editorOrAbove, updateStatusValidation, validate, contactController.updateStatus);
router.post('/:id/notes', protect, editorOrAbove, addNoteValidation, validate, contactController.addNote);
router.post('/bulk-status', protect, editorOrAbove, contactController.bulkUpdateStatus);

// Super admin routes
router.delete('/:id', protect, superAdminOnly, contactController.deleteContact);

export default router;