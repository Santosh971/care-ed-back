import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Upload image to Cloudinary
export const uploadImage = async (file, folder = 'careed/images') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      success: true,
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Upload icon to Cloudinary
export const uploadIcon = async (file, folder = 'careed/icons') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
        { width: 128, height: 128, crop: 'limit' }
      ]
    });

    return {
      success: true,
      publicId: result.public_id,
      url: result.secure_url
    };
  } catch (error) {
    console.error('Cloudinary icon upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      result: result.result
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get image details
export const getImageDetails = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return {
      success: true,
      details: {
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        createdAt: result.created_at
      }
    };
  } catch (error) {
    console.error('Cloudinary get details error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default cloudinary;