import cloudinary, { uploadImage, uploadIcon, deleteImage, getImageDetails } from '../config/cloudinary.js';

class CloudinaryService {
  // Upload with transformation
  async uploadWithTransformation(file, options = {}) {
    const {
      folder = 'careed/images',
      width,
      height,
      crop = 'fill',
      quality = 'auto:good',
      format = 'auto'
    } = options;

    const transformation = [];

    if (width || height) {
      transformation.push({
        width: width || undefined,
        height: height || undefined,
        crop
      });
    }

    transformation.push({ quality });
    transformation.push({ fetch_format: format });

    try {
      const result = await cloudinary.uploader.upload(file, {
        folder,
        transformation,
        resource_type: 'image'
      });

      return {
        success: true,
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Generate optimized URL
  getOptimizedUrl(publicId, options = {}) {
    const {
      width,
      height,
      crop = 'fill',
      quality = 'auto',
      format = 'auto',
      gravity = 'auto'
    } = options;

    return cloudinary.url(publicId, {
      secure: true,
      transformation: [
        { width, height, crop, gravity },
        { quality },
        { fetch_format: format }
      ].filter(t => Object.values(t).some(v => v !== undefined))
    });
  }

  // Generate responsive image URLs
  getResponsiveUrls(publicId, sizes = [320, 640, 960, 1280]) {
    return sizes.map(size => ({
      width: size,
      url: this.getOptimizedUrl(publicId, { width: size, height: Math.round(size * 0.5625) })
    }));
  }

  // Generate thumbnail
  getThumbnailUrl(publicId, size = 150) {
    return this.getOptimizedUrl(publicId, {
      width: size,
      height: size,
      crop: 'thumb',
      gravity: 'face'
    });
  }

  // Upload base64 image
  async uploadBase64(base64String, options = {}) {
    try {
      const result = await cloudinary.uploader.upload(base64String, {
        folder: options.folder || 'careed/images',
        resource_type: 'image'
      });

      return {
        success: true,
        publicId: result.public_id,
        url: result.secure_url
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create upload preset signature (for direct uploads from frontend)
  generateUploadSignature(paramsToSign = {}) {
    const timestamp = Math.round(Date.now() / 1000);
    const params = {
      timestamp,
      ...paramsToSign
    };

    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);

    return {
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    };
  }

  // Get resource list
  async getResources(options = {}) {
    const {
      type = 'upload',
      prefix = 'careed/',
      max_results = 50,
      next_cursor
    } = options;

    try {
      const result = await cloudinary.api.resources({
        type,
        prefix,
        max_results,
        next_cursor
      });

      return {
        success: true,
        resources: result.resources,
        next_cursor: result.next_cursor
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete multiple resources
  async deleteMultiple(publicIds) {
    try {
      const result = await cloudinary.api.delete_resources(publicIds);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Rename resource
  async renameResource(oldPublicId, newPublicId) {
    try {
      const result = await cloudinary.uploader.rename(oldPublicId, newPublicId);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new CloudinaryService();