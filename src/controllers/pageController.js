import Page from '../models/Page.js';
import Media from '../models/Media.js';
import { successResponse, errorResponse, notFoundResponse } from '../utils/response.js';
import { handleUpload, handleDelete } from '../middlewares/upload.js';

// Helper function to process image uploads
const processImageUploads = async (files, folder = 'sections') => {
  const uploadedImages = [];

  if (!files || files.length === 0) {
    return uploadedImages;
  }

  for (const file of files) {
    try {
      const result = await handleUpload(file, folder);

      if (result.success) {
        uploadedImages.push({
          url: result.secure_url,
          publicId: result.public_id,
          alt: file.originalname?.split('.')[0] || ''
        });

        // Create media record for tracking
        try {
          await Media.create({
            publicId: result.public_id,
            url: result.secure_url,
            alt: file.originalname?.split('.')[0] || '',
            filename: file.originalname,
            folder: folder,
            resourceType: 'image',
            format: result.format,
            width: result.width,
            height: result.height,
            size: file.size
          });
        } catch (mediaError) {
          console.error('[processImageUploads] Failed to create media record:', mediaError);
          // Continue - image is still uploaded to Cloudinary
        }
      }
    } catch (error) {
      console.error('[processImageUploads] Upload error:', error);
    }
  }

  return uploadedImages;
};

// Helper function to process single image upload
const processSingleImage = async (file, folder = 'sections') => {
  if (!file) return null;

  try {
    const result = await handleUpload(file, folder);

    if (result.success) {
      // Create media record
      try {
        await Media.create({
          publicId: result.public_id,
          url: result.secure_url,
          alt: file.originalname?.split('.')[0] || '',
          filename: file.originalname,
          folder: folder,
          resourceType: 'image',
          format: result.format,
          width: result.width,
          height: result.height,
          size: file.size
        });
      } catch (mediaError) {
        console.error('[processSingleImage] Failed to create media record:', mediaError);
      }

      return {
        url: result.secure_url,
        publicId: result.public_id,
        alt: file.originalname?.split('.')[0] || ''
      };
    }
  } catch (error) {
    console.error('[processSingleImage] Upload error:', error);
  }

  return null;
};

// @desc    Get page by pageId
// @route   GET /api/pages/:pageId
// @access  Public
export const getPage = async (req, res) => {
  try {
    const { pageId } = req.params;

    const page = await Page.findOne({ pageId }).populate('metadata.updatedBy', 'name email');

    if (!page) {
      return notFoundResponse(res, `Page '${pageId}' not found`);
    }

    // Filter active sections
    const activeSections = page.sections.filter(section => section.isActive);

    return successResponse(res, {
      pageId: page.pageId,
      title: page.title,
      sections: activeSections,
      metadata: page.metadata
    }, 'Page retrieved successfully');
  } catch (error) {
    console.error('Get page error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Get all pages (for admin)
// @route   GET /api/pages
// @access  Private
export const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find({})
      .select('pageId title metadata.lastUpdated')
      .populate('metadata.updatedBy', 'name email')
      .sort({ pageId: 1 });

    return successResponse(res, pages, 'Pages retrieved successfully');
  } catch (error) {
    console.error('Get all pages error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Get section by sectionId
// @route   GET /api/pages/:pageId/sections/:sectionId
// @access  Public
export const getSection = async (req, res) => {
  try {
    const { pageId, sectionId } = req.params;

    const page = await Page.findOne({ pageId });

    if (!page) {
      return notFoundResponse(res, `Page '${pageId}' not found`);
    }

    const section = page.sections.find(s => s.sectionId === sectionId);

    if (!section) {
      return notFoundResponse(res, `Section '${sectionId}' not found in page '${pageId}'`);
    }

    if (!section.isActive) {
      return errorResponse(res, 'Section is not active', 404);
    }

    return successResponse(res, section, 'Section retrieved successfully');
  } catch (error) {
    console.error('Get section error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Update section
// @route   PUT /api/pages/:pageId/sections/:sectionId
// @access  Private
export const updateSection = async (req, res) => {
  try {
    const { pageId, sectionId } = req.params;
    let updateData = req.body;
    const uploadedFiles = req.files || {};
    const singleImage = req.file || null;

    console.log('[updateSection] ========================================');
    console.log('[updateSection] pageId:', pageId, 'sectionId:', sectionId);
    console.log('[updateSection] Body keys:', Object.keys(updateData));
    console.log('[updateSection] Files:', Object.keys(uploadedFiles));
    console.log('[updateSection] Single file:', singleImage ? singleImage.originalname : 'none');

    const page = await Page.findOne({ pageId });

    if (!page) {
      return notFoundResponse(res, `Page '${pageId}' not found`);
    }

    // Find section index
    const sectionIndex = page.sections.findIndex(s => s.sectionId === sectionId);
    const existingSection = sectionIndex > -1 ? page.sections[sectionIndex].toObject() : null;

    // Parse JSON fields if they came as strings (from multipart form)
    try {
      if (typeof updateData.title === 'string') {
        // Already string, no need to parse
      }
      if (updateData.images && typeof updateData.images === 'string') {
        updateData.images = JSON.parse(updateData.images);
      }
      if (updateData.features && typeof updateData.features === 'string') {
        updateData.features = JSON.parse(updateData.features);
      }
      if (updateData.items && typeof updateData.items === 'string') {
        updateData.items = JSON.parse(updateData.items);
      }
      if (updateData.buttons && typeof updateData.buttons === 'string') {
        updateData.buttons = JSON.parse(updateData.buttons);
      }
      if (updateData.content && typeof updateData.content === 'string') {
        updateData.content = JSON.parse(updateData.content);
      }
      if (updateData.trustIndicators && typeof updateData.trustIndicators === 'string') {
        updateData.trustIndicators = JSON.parse(updateData.trustIndicators);
      }
      if (updateData.badge && typeof updateData.badge === 'string') {
        updateData.badge = JSON.parse(updateData.badge);
      }
    } catch (parseError) {
      console.warn('[updateSection] Failed to parse JSON fields:', parseError);
    }

    // Process uploaded images array (multiple images)
    if (uploadedFiles.images && uploadedFiles.images.length > 0) {
      console.log('[updateSection] Processing images array:', uploadedFiles.images.length);
      const uploadedImages = await processImageUploads(uploadedFiles.images, 'sections');

      if (uploadedImages.length > 0) {
        // Merge with existing images or replace
        const existingImages = existingSection?.images || [];
        updateData.images = [...existingImages, ...uploadedImages];
        console.log('[updateSection] Uploaded images:', uploadedImages.length);
      }
    }

    // Process single image upload
    if (singleImage) {
      console.log('[updateSection] Processing single image:', singleImage.originalname);
      const uploadedImage = await processSingleImage(singleImage, 'sections');

      if (uploadedImage) {
        // Determine which field this image belongs to based on field name
        const fieldName = singleImage.fieldname;
        if (fieldName === 'image' || fieldName === 'heroImage') {
          updateData.image = uploadedImage;
        } else if (fieldName === 'images') {
          const existingImages = existingSection?.images || [];
          updateData.images = [...existingImages, uploadedImage];
        } else {
          // Default to images array
          const existingImages = existingSection?.images || [];
          updateData.images = [...existingImages, uploadedImage];
        }
        console.log('[updateSection] Single image uploaded:', uploadedImage.url);
      }
    }

    // Handle image removal requests
    if (updateData._removeImages && Array.isArray(updateData._removeImages)) {
      const removePublicIds = updateData._removeImages;
      const existingImages = existingSection?.images || [];

      // Delete from Cloudinary
      for (const publicId of removePublicIds) {
        try {
          await handleDelete(publicId);
        } catch (err) {
          console.warn('[updateSection] Failed to delete from Cloudinary:', publicId);
        }
      }

      // Filter out removed images
      updateData.images = existingImages.filter(img => !removePublicIds.includes(img.publicId));
      delete updateData._removeImages;
    }

    // Clear image field if requested
    if (updateData._clearImage) {
      if (existingSection?.image?.publicId) {
        try {
          await handleDelete(existingSection.image.publicId);
        } catch (err) {
          console.warn('[updateSection] Failed to delete old image from Cloudinary');
        }
      }
      updateData.image = null;
      delete updateData._clearImage;
    }

    // Clean up any blob URLs in the data
    const cleanObject = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;

      const cleaned = Array.isArray(obj) ? [] : {};

      for (const key in obj) {
        const value = obj[key];

        if (typeof value === 'string' && (value.startsWith('blob:') || value.startsWith('data:'))) {
          // Skip blob/data URLs
          continue;
        } else if (key === 'url' && typeof value === 'string' && (value.startsWith('blob:') || value.startsWith('data:'))) {
          // Skip invalid URLs
          continue;
        } else if (typeof value === 'object' && value !== null) {
          cleaned[key] = cleanObject(value);
        } else {
          cleaned[key] = value;
        }
      }

      return cleaned;
    };

    updateData = cleanObject(updateData);

    if (sectionIndex === -1) {
      // Create new section if it doesn't exist
      page.sections.push({
        sectionId,
        ...updateData,
        isActive: updateData.isActive !== undefined ? updateData.isActive : true
      });
    } else {
      // Update existing section
      page.sections[sectionIndex] = {
        ...page.sections[sectionIndex].toObject(),
        ...updateData
      };
    }

    // Update metadata
    page.metadata = {
      lastUpdated: new Date(),
      updatedBy: req.admin._id
    };

    await page.save();

    // Get updated section
    const updatedSection = page.sections.find(s => s.sectionId === sectionId);

    console.log('[updateSection] Section updated successfully');

    return successResponse(res, updatedSection, 'Section updated successfully');
  } catch (error) {
    console.error('[updateSection] Error:', error);
    return errorResponse(res, error.message || 'Server error', 500);
  }
};

// @desc    Create new page
// @route   POST /api/pages
// @access  Private
export const createPage = async (req, res) => {
  try {
    const { pageId, title, sections = [] } = req.body;

    if (!pageId || !title) {
      return errorResponse(res, 'pageId and title are required', 400);
    }

    // Check if page already exists
    const existingPage = await Page.findOne({ pageId });

    if (existingPage) {
      return errorResponse(res, `Page '${pageId}' already exists`, 400);
    }

    const page = await Page.create({
      pageId,
      title,
      sections,
      metadata: {
        lastUpdated: new Date(),
        updatedBy: req.admin._id
      }
    });

    return successResponse(res, page, 'Page created successfully', 201);
  } catch (error) {
    console.error('Create page error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Delete page
// @route   DELETE /api/pages/:pageId
// @access  Private (super_admin)
export const deletePage = async (req, res) => {
  try {
    const { pageId } = req.params;

    const page = await Page.findOneAndDelete({ pageId });

    if (!page) {
      return notFoundResponse(res, `Page '${pageId}' not found`);
    }

    return successResponse(res, null, 'Page deleted successfully');
  } catch (error) {
    console.error('Delete page error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Toggle section active status
// @route   PATCH /api/pages/:pageId/sections/:sectionId/toggle
// @access  Private
export const toggleSection = async (req, res) => {
  try {
    const { pageId, sectionId } = req.params;

    const page = await Page.findOne({ pageId });

    if (!page) {
      return notFoundResponse(res, `Page '${pageId}' not found`);
    }

    const section = page.sections.find(s => s.sectionId === sectionId);

    if (!section) {
      return notFoundResponse(res, `Section '${sectionId}' not found`);
    }

    section.isActive = !section.isActive;
    page.metadata = {
      lastUpdated: new Date(),
      updatedBy: req.admin._id
    };

    await page.save();

    return successResponse(res, {
      sectionId,
      isActive: section.isActive
    }, `Section ${section.isActive ? 'activated' : 'deactivated'} successfully`);
  } catch (error) {
    console.error('Toggle section error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Reorder sections
// @route   PUT /api/pages/:pageId/reorder
// @access  Private
export const reorderSections = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { sectionOrder } = req.body; // Array of sectionIds in new order

    if (!Array.isArray(sectionOrder)) {
      return errorResponse(res, 'sectionOrder must be an array', 400);
    }

    const page = await Page.findOne({ pageId });

    if (!page) {
      return notFoundResponse(res, `Page '${pageId}' not found`);
    }

    // Create a map of sectionId to section
    const sectionMap = {};
    page.sections.forEach(section => {
      sectionMap[section.sectionId] = section;
    });

    // Reorder sections
    const reorderedSections = [];
    sectionOrder.forEach((sectionId, index) => {
      if (sectionMap[sectionId]) {
        sectionMap[sectionId].order = index + 1;
        reorderedSections.push(sectionMap[sectionId]);
      }
    });

    // Add any sections not in the order array
    page.sections.forEach(section => {
      if (!sectionOrder.includes(section.sectionId)) {
        reorderedSections.push(section);
      }
    });

    page.sections = reorderedSections;
    page.metadata = {
      lastUpdated: new Date(),
      updatedBy: req.admin._id
    };

    await page.save();

    return successResponse(res, page.sections, 'Sections reordered successfully');
  } catch (error) {
    console.error('Reorder sections error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Get page history
// @route   GET /api/pages/:pageId/history
// @access  Private
export const getPageHistory = async (req, res) => {
  try {
    const { pageId } = req.params;

    // This would require a history collection or audit log
    // For now, return the current metadata
    const page = await Page.findOne({ pageId }).populate('metadata.updatedBy', 'name email');

    if (!page) {
      return notFoundResponse(res, `Page '${pageId}' not found`);
    }

    return successResponse(res, {
      pageId: page.pageId,
      lastUpdated: page.metadata.lastUpdated,
      updatedBy: page.metadata.updatedBy
    }, 'Page history retrieved successfully');
  } catch (error) {
    console.error('Get page history error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// Helper function to check if a URL is a blob URL
const isBlobUrl = (url) => {
  if (!url) return false;
  if (typeof url !== 'string') return false;
  return url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('file:');
};

// Helper function to clean images array
const cleanImagesArray = (images) => {
  if (!images || !Array.isArray(images)) return images;

  return images.map(img => {
    if (typeof img === 'string') {
      return isBlobUrl(img) ? null : img;
    }
    if (img && typeof img === 'object') {
      if (isBlobUrl(img.url)) {
        return null;
      }
      return img;
    }
    return img;
  }).filter(Boolean);
};

// Helper function to clean a section
const cleanSection = (section) => {
  if (!section) return section;

  const cleaned = { ...section.toObject ? section.toObject() : section };

  // Clean images array
  if (cleaned.images && Array.isArray(cleaned.images)) {
    cleaned.images = cleanImagesArray(cleaned.images);
  }

  // Clean single image field
  if (isBlobUrl(cleaned.image)) {
    cleaned.image = null;
  }

  // Clean items array if items have image fields
  if (cleaned.items && Array.isArray(cleaned.items)) {
    cleaned.items = cleaned.items.map(item => {
      if (!item) return item;

      const cleanedItem = item.toObject ? item.toObject() : { ...item };

      if (isBlobUrl(cleanedItem.image)) {
        cleanedItem.image = null;
      }

      if (cleanedItem.images && Array.isArray(cleanedItem.images)) {
        cleanedItem.images = cleanImagesArray(cleanedItem.images);
      }

      return cleanedItem;
    });
  }

  // Clean content.image and content.images
  if (cleaned.content) {
    const cleanedContent = { ...cleaned.content };

    if (isBlobUrl(cleanedContent.image)) {
      cleanedContent.image = null;
    }

    if (cleanedContent.images && Array.isArray(cleanedContent.images)) {
      cleanedContent.images = cleanImagesArray(cleanedContent.images);
    }

    cleaned.content = cleanedContent;
  }

  return cleaned;
};

// @desc    Clean all blob URLs from database
// @route   POST /api/pages/cleanup-blobs
// @access  Private (super_admin only)
export const cleanupBlobUrls = async (req, res) => {
  try {
    console.log('[cleanupBlobUrls] Starting blob URL cleanup...');

    const pages = await Page.find({});
    let totalPages = 0;
    let totalSections = 0;
    let totalCleaned = 0;

    for (const page of pages) {
      totalPages++;
      let pageModified = false;

      const cleanedSections = page.sections.map(section => {
        const originalSection = JSON.stringify(section.toObject ? section.toObject() : section);
        const cleaned = cleanSection(section);
        const cleanedSection = JSON.stringify(cleaned);

        if (originalSection !== cleanedSection) {
          pageModified = true;
          totalSections++;
          // Count blob URLs removed
          const originalMatches = (originalSection.match(/"blob:[^"]*"/g) || []).length;
          totalCleaned += originalMatches;
        }

        return cleaned;
      });

      if (pageModified) {
        page.sections = cleanedSections;
        page.metadata = {
          ...page.metadata,
          lastUpdated: new Date(),
          updatedBy: req.admin?._id || null
        };
        await page.save();
        console.log(`[cleanupBlobUrls] Cleaned page: ${page.pageId}`);
      }
    }

    console.log(`[cleanupBlobUrls] Cleanup complete. Pages: ${totalPages}, Sections modified: ${totalSections}, Blob URLs removed: ${totalCleaned}`);

    return successResponse(res, {
      totalPages,
      sectionsModified: totalSections,
      blobUrlsRemoved: totalCleaned
    }, 'Blob URL cleanup completed successfully');
  } catch (error) {
    console.error('Cleanup blob URLs error:', error);
    return errorResponse(res, 'Server error during cleanup', 500);
  }
};

export default {
  getPage,
  getAllPages,
  getSection,
  updateSection,
  createPage,
  deletePage,
  toggleSection,
  reorderSections,
  getPageHistory,
  cleanupBlobUrls
};