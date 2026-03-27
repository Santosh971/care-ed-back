import { Router } from 'express';
import { body, param, query } from 'express-validator';
import mediaController from '../controllers/mediaController.js';
import { protect, editorOrAbove } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

// All media routes require authentication
router.use(protect);

// Validation rules
const updateMediaValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid media ID'),
  body('alt')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Alt text must be less than 200 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

const bulkDeleteValidation = [
  body('ids')
    .isArray({ min: 1 })
    .withMessage('IDs must be a non-empty array')
];

// Upload routes (editor+)
router.post('/upload/image', editorOrAbove, mediaController.uploadImageFile);
router.post('/upload/icon', editorOrAbove, mediaController.uploadIconFile);

// Media management routes
router.get('/', mediaController.getMedia);
router.get('/stats', mediaController.getMediaStats);
router.get('/:id', mediaController.getSingleMedia);
router.put('/:id', editorOrAbove, updateMediaValidation, validate, mediaController.updateMedia);
router.delete('/:id', editorOrAbove, mediaController.deleteMedia);

// Bulk operations
router.post('/bulk-delete', editorOrAbove, bulkDeleteValidation, validate, mediaController.bulkDelete);

export default router;