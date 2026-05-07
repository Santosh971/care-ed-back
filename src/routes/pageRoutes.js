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

// Validation for creating child page
const createChildPageValidation = [
  body('pageId')
    .trim()
    .notEmpty()
    .withMessage('pageId is required')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('pageId must be lowercase with hyphens only'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters'),
  body('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug is required')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must be lowercase with hyphens only'),
  body('parentCategory')
    .trim()
    .notEmpty()
    .withMessage('parentCategory is required')
];

// ===========================================
// PUBLIC ROUTES
// ===========================================

// Get child pages by parent category (must be before /:pageId)
router.get('/children/:parentCategory', pageController.getChildPages);

// Get page by slug (must be before /:pageId)
router.get('/slug/:slug', pageController.getPageBySlug);

// Get page by pageId
router.get('/:pageId', pageController.getPage);

// Get section by sectionId
router.get('/:pageId/sections/:sectionId', pageController.getSection);

// ===========================================
// PROTECTED ROUTES (require authentication)
// ===========================================

// Get all pages (admin)
router.get('/', protect, pageController.getAllPages);

// Get pages with filtering (admin)
router.get('/admin/list', protect, pageController.getAdminPages);

// Get full page (including inactive) - for admin editing
router.get('/:pageId/full', protect, pageController.getPageFull);

// ===========================================
// EDITOR+ ROUTES
// ===========================================

// Create new page
router.post('/', protect, editorOrAbove, createPageValidation, validate, pageController.createPage);

// Create child page (for international students module)
router.post('/child', protect, editorOrAbove, createChildPageValidation, validate, pageController.createChildPage);

// Update child page
router.put('/child/:pageId', protect, editorOrAbove, pageController.updateChildPage);

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

// ===========================================
// SUPER ADMIN ROUTES
// ===========================================

// Delete page
router.delete('/:pageId', protect, superAdminOnly, pageController.deletePage);

// Utility routes
router.post('/cleanup-blobs', protect, superAdminOnly, pageController.cleanupBlobUrls);

export default router;