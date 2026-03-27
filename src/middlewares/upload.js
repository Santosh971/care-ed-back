import dotenv from 'dotenv';
// Load environment variables FIRST - this must be at the top before any other imports
dotenv.config();

import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

console.log('[Cloudinary Config] Setting up Cloudinary...');
console.log('[Cloudinary Config] Cloud name:', process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET');
console.log('[Cloudinary Config] API Key:', process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'NOT SET');
console.log('[Cloudinary Config] API Secret:', process.env.CLOUDINARY_API_SECRET ? '***SET' : 'NOT SET');

// Configure Cloudinary
const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('[Cloudinary Config] ERROR: Missing required environment variables!');
    console.error('[Cloudinary Config] CLOUDINARY_CLOUD_NAME:', cloudName ? 'SET' : 'MISSING');
    console.error('[Cloudinary Config] CLOUDINARY_API_KEY:', apiKey ? 'SET' : 'MISSING');
    console.error('[Cloudinary Config] CLOUDINARY_API_SECRET:', apiSecret ? 'SET' : 'MISSING');
    return false;
  }

  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
    console.log('[Cloudinary Config] Cloudinary configured successfully');
    return true;
  } catch (error) {
    console.error('[Cloudinary Config] Failed to configure Cloudinary:', error);
    return false;
  }
};

// Configure immediately
configureCloudinary();

// Memory storage for processing before Cloudinary upload
const memoryStorage = multer.memoryStorage();

// File filter for images
const imageFileFilter = (req, file, cb) => {
  console.log('[Multer] File filter check:', {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype
  });

  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/avif',
    'image/svg+xml'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    console.log('[Multer] File type accepted');
    cb(null, true);
  } else {
    console.error('[Multer] File type rejected:', file.mimetype);
    cb(new Error(`Invalid file type: ${file.mimetype}. Only image files are allowed.`), false);
  }
};

// Upload to Cloudinary from buffer
const uploadToCloudinary = (buffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      reject(new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.'));
      return;
    }

    console.log('[Cloudinary] Starting upload to folder:', folder);

    const uploadOptions = {
      folder: `careed/${folder}`,
      resource_type: 'image',
      transformation: [{ quality: 'auto:good' }, { fetch_format: 'auto' }],
      ...options
    };

    console.log('[Cloudinary] Upload options:', JSON.stringify(uploadOptions, null, 2));

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('[Cloudinary] Upload error:', error);
          reject(error);
        } else {
          console.log('[Cloudinary] Upload successful:', {
            public_id: result.public_id,
            secure_url: result.secure_url,
            width: result.width,
            height: result.height
          });
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Multer upload instances
export const uploadImage = multer({
  storage: memoryStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export const uploadIcon = multer({
  storage: memoryStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit for icons
  }
});

export const uploadGeneral = multer({
  storage: memoryStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  }
});

// Handle file upload and return Cloudinary result
export const handleUpload = async (file, folder = 'images') => {
  console.log('[handleUpload] Starting upload to Cloudinary...');
  console.log('[handleUpload] File info:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: `${(file.size / 1024).toFixed(2)} KB`,
    folder: folder
  });

  // Verify Cloudinary configuration
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    const errorMsg = 'Cloudinary credentials not configured. Please check your .env file for CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET';
    console.error('[handleUpload]', errorMsg);
    return {
      success: false,
      error: errorMsg
    };
  }

  try {
    const result = await uploadToCloudinary(file.buffer, folder);
    console.log('[handleUpload] Cloudinary upload successful:', {
      public_id: result.public_id,
      secure_url: result.secure_url
    });

    return {
      success: true,
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type
    };
  } catch (error) {
    console.error('[handleUpload] Cloudinary upload failed:', error);
    return {
      success: false,
      error: error.message || 'Unknown error during Cloudinary upload'
    };
  }
};

// Delete from Cloudinary
export const handleDelete = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      result: result.result
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  uploadImage,
  uploadIcon,
  uploadGeneral,
  handleUpload,
  handleDelete
};