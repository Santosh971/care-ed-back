import Media from '../models/Media.js';
import { uploadImage, uploadIcon, handleUpload, handleDelete } from '../middlewares/upload.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

// Helper function to handle multer upload as a promise
const handleMulterUpload = (req, res, multerMiddleware) => {
  return new Promise((resolve, reject) => {
    multerMiddleware(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// @desc    Upload image
// @route   POST /api/media/upload/image
// @access  Private
export const uploadImageFile = async (req, res) => {
  console.log('[uploadImageFile] ========================================');
  console.log('[uploadImageFile] Starting image upload...');
  console.log('[uploadImageFile] Content-Type:', req.headers['content-type']);
  console.log('[uploadImageFile] Authorization:', req.headers.authorization ? 'Bearer ***' : 'NOT SET');

  try {
    // Handle multer upload
    await handleMulterUpload(req, res, uploadImage.single('file'));

    console.log('[uploadImageFile] Multer processed file');

    if (!req.file) {
      console.error('[uploadImageFile] No file in request');
      return errorResponse(res, 'No file uploaded', 400);
    }

    console.log('[uploadImageFile] File received:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: `${(req.file.size / 1024).toFixed(2)} KB`,
      buffer: req.file.buffer ? `${req.file.buffer.length} bytes` : 'NO BUFFER'
    });

    // Upload to Cloudinary
    console.log('[uploadImageFile] Uploading to Cloudinary...');
    const result = await handleUpload(req.file, 'images');
    console.log('[uploadImageFile] Cloudinary result:', result);

    if (!result.success) {
      console.error('[uploadImageFile] Cloudinary upload failed:', result.error);
      return errorResponse(res, result.error || 'Failed to upload to Cloudinary', 500);
    }

    // Create media record
    console.log('[uploadImageFile] Creating media record in database...');
    const media = await Media.create({
      publicId: result.public_id,
      url: result.secure_url,
      alt: req.body.alt || req.file.originalname.split('.')[0],
      filename: req.file.originalname,
      folder: 'images',
      resourceType: 'image',
      format: result.format,
      width: result.width,
      height: result.height,
      size: req.file.size,
      uploadedBy: req.admin._id,
      tags: req.body.tags?.split(',').map(t => t.trim()) || []
    });

    console.log('[uploadImageFile] Media created:', media._id);
    console.log('[uploadImageFile] Upload complete!');

    return successResponse(res, {
      id: media._id,
      publicId: media.publicId,
      url: media.url,
      alt: media.alt
    }, 'Image uploaded successfully', 201);
  } catch (error) {
    console.error('[uploadImageFile] ERROR:', error);
    console.error('[uploadImageFile] Error message:', error.message);
    console.error('[uploadImageFile] Error stack:', error.stack);

    if (error.message && error.message.includes('Invalid file type')) {
      return errorResponse(res, error.message, 400);
    }
    if (error.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, 'File too large. Maximum size is 10MB', 400);
    }

    return errorResponse(res, error.message || 'Server error during upload', 500);
  }
};

// @desc    Upload icon
// @route   POST /api/media/upload/icon
// @access  Private
export const uploadIconFile = async (req, res) => {
  try {
    uploadIcon.single('file')(req, res, async (err) => {
      if (err) {
        return errorResponse(res, err.message || 'Upload failed', 400);
      }

      if (!req.file) {
        return errorResponse(res, 'No file uploaded', 400);
      }

      // Upload to Cloudinary with icon transformations
      const result = await handleUpload(req.file, 'icons', {
        transformation: [{ width: 128, height: 128, crop: 'limit' }]
      });

      if (!result.success) {
        return errorResponse(res, result.error || 'Failed to upload to Cloudinary', 500);
      }

      const media = await Media.create({
        publicId: result.public_id,
        url: result.secure_url,
        alt: req.body.alt || '',
        filename: req.file.originalname,
        folder: 'icons',
        resourceType: 'image',
        format: result.format,
        width: result.width,
        height: result.height,
        size: req.file.size,
        uploadedBy: req.admin._id
      });

      return successResponse(res, {
        id: media._id,
        publicId: media.publicId,
        url: media.url,
        alt: media.alt
      }, 'Icon uploaded successfully', 201);
    });
  } catch (error) {
    console.error('Upload icon error:', error);
    return errorResponse(res, 'Server error during upload', 500);
  }
};

// @desc    Get all media
// @route   GET /api/media
// @access  Private
export const getMedia = async (req, res) => {
  try {
    const { page = 1, limit = 20, folder, search } = req.query;

    const query = {};

    if (folder) {
      query.folder = folder;
    }

    if (search) {
      query.$or = [
        { alt: { $regex: search, $options: 'i' } },
        { filename: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const total = await Media.countDocuments(query);
    const media = await Media.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return paginatedResponse(res, media, parseInt(page), parseInt(limit), total, 'Media retrieved successfully');
  } catch (error) {
    console.error('Get media error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Get single media
// @route   GET /api/media/:id
// @access  Private
export const getSingleMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id).populate('uploadedBy', 'name email');

    if (!media) {
      return errorResponse(res, 'Media not found', 404);
    }

    return successResponse(res, media, 'Media retrieved successfully');
  } catch (error) {
    console.error('Get media error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Update media metadata
// @route   PUT /api/media/:id
// @access  Private
export const updateMedia = async (req, res) => {
  try {
    const { alt, tags } = req.body;

    const media = await Media.findById(req.params.id);

    if (!media) {
      return errorResponse(res, 'Media not found', 404);
    }

    if (alt !== undefined) media.alt = alt;
    if (tags) media.tags = tags;

    await media.save();

    return successResponse(res, media, 'Media updated successfully');
  } catch (error) {
    console.error('Update media error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Delete media
// @route   DELETE /api/media/:id
// @access  Private
export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return errorResponse(res, 'Media not found', 404);
    }

    // Delete from Cloudinary
    if (media.publicId) {
      await handleDelete(media.publicId);
    }

    // Delete from database
    await media.deleteOne();

    return successResponse(res, null, 'Media deleted successfully');
  } catch (error) {
    console.error('Delete media error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Bulk delete media
// @route   POST /api/media/bulk-delete
// @access  Private
export const bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return errorResponse(res, 'Please provide an array of media IDs', 400);
    }

    const media = await Media.find({ _id: { $in: ids } });

    // Delete from Cloudinary
    for (const item of media) {
      if (item.publicId) {
        await handleDelete(item.publicId);
      }
    }

    // Delete from database
    await Media.deleteMany({ _id: { $in: ids } });

    return successResponse(res, { deletedCount: ids.length }, 'Media deleted successfully');
  } catch (error) {
    console.error('Bulk delete error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Get media stats
// @route   GET /api/media/stats
// @access  Private
export const getMediaStats = async (req, res) => {
  try {
    const stats = await Media.aggregate([
      {
        $group: {
          _id: '$folder',
          count: { $sum: 1 },
          totalSize: { $sum: '$size' }
        }
      }
    ]);

    const totalMedia = await Media.countDocuments();

    return successResponse(res, {
      byFolder: stats,
      total: totalMedia
    }, 'Stats retrieved successfully');
  } catch (error) {
    console.error('Get stats error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

export default {
  uploadImageFile,
  uploadIconFile,
  getMedia,
  getSingleMedia,
  updateMedia,
  deleteMedia,
  bulkDelete,
  getMediaStats
};