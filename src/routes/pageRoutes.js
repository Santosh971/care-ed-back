import { Router } from 'express';
import { body, param, query } from 'express-validator';
import pageController from '../controllers/pageController.js';
import { protect, superAdminOnly, editorOrAbove } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { uploadImage, uploadGeneral } from '../middlewares/upload.js';

const router = Router();

// Validation rules
const createPageValidation = [
  body('pageId')
    .trim()
    .notEmpty()
    .withMessage('pageId is required')
    .isSlug()
    .withMessage('pageId must be a valid slug (lowercase, hyphens only)'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters')
];

const updateSectionValidation = [
  param('pageId')
    .trim()
    .notEmpty()
    .withMessage('Page ID is required'),
  param('sectionId')
    .trim()
    .notEmpty()
    .withMessage('Section ID is required')
];

const reorderValidation = [
  body('sectionOrder')
    .isArray()
    .withMessage('sectionOrder must be an array')
];

// Public routes
router.get('/:pageId', pageController.getPage);
router.get('/:pageId/sections/:sectionId', pageController.getSection);

// Protected routes (require authentication)
router.get('/', protect, pageController.getAllPages);

// Get full page (including inactive) - for admin editing
router.get('/:pageId/full', protect, pageController.getPageFull);

// Editor+ routes
router.post('/', protect, editorOrAbove, createPageValidation, validate, pageController.createPage);

// Save entire page (for legal pages)
router.put('/:pageId', protect, editorOrAbove, pageController.savePage);

// Section update route with file upload support
// Supports both JSON and multipart/form-data
// Fields:
//   - image (single file): For single image uploads (hero, background, etc.)
//   - images (multiple files): For multiple image uploads
//   - All other fields as JSON (can also be sent as form fields)
router.put('/:pageId/sections/:sectionId',
  protect,
  editorOrAbove,
  updateSectionValidation,
  validate,
  // Handle both JSON and multipart/form-data
  (req, res, next) => {
    const contentType = req.headers['content-type'] || '';

    if (contentType.includes('multipart/form-data')) {
      // Use multer for multipart uploads - support both single and multiple images
      uploadGeneral.fields([
        { name: 'image', maxCount: 1 },
        { name: 'images', maxCount: 10 },
        { name: 'heroImage', maxCount: 1 },
        { name: 'backgroundImage', maxCount: 1 }
      ])(req, res, next);
    } else {
      // No multer needed for JSON requests
      next();
    }
  },
  pageController.updateSection
);

router.patch('/:pageId/sections/:sectionId/toggle', protect, editorOrAbove, pageController.toggleSection);
router.put('/:pageId/reorder', protect, editorOrAbove, reorderValidation, validate, pageController.reorderSections);
router.get('/:pageId/history', protect, pageController.getPageHistory);

// Super admin routes
router.delete('/:pageId', protect, superAdminOnly, pageController.deletePage);

// Utility routes
router.post('/cleanup-blobs', protect, superAdminOnly, pageController.cleanupBlobUrls);

export default router;