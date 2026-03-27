import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

// @desc    Get all admins
// @route   GET /api/admins
// @access  Private (super_admin)
export const getAdmins = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Admin.countDocuments(query);
    const admins = await Admin.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return paginatedResponse(res, admins, parseInt(page), parseInt(limit), total, 'Admins retrieved successfully');
  } catch (error) {
    console.error('Get admins error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Get single admin
// @route   GET /api/admins/:id
// @access  Private (super_admin)
export const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return errorResponse(res, 'Admin not found', 404);
    }

    return successResponse(res, admin, 'Admin retrieved successfully');
  } catch (error) {
    console.error('Get admin error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Create new admin
// @route   POST /api/admins
// @access  Private (super_admin)
export const createAdmin = async (req, res) => {
  try {
    const { email, password, name, role = 'editor' } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return errorResponse(res, 'Please provide email, password, and name', 400);
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });

    if (existingAdmin) {
      return errorResponse(res, 'Admin with this email already exists', 400);
    }

    // Create admin
    const admin = await Admin.create({
      email: email.toLowerCase(),
      password,
      name,
      role
    });

    return successResponse(res, admin, 'Admin created successfully', 201);
  } catch (error) {
    console.error('Create admin error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Update admin
// @route   PUT /api/admins/:id
// @access  Private (super_admin)
export const updateAdmin = async (req, res) => {
  try {
    const { name, role, isActive } = req.body;

    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return errorResponse(res, 'Admin not found', 404);
    }

    // Update fields
    if (name) admin.name = name;
    if (role) admin.role = role;
    if (typeof isActive !== 'undefined') admin.isActive = isActive;

    await admin.save();

    return successResponse(res, admin, 'Admin updated successfully');
  } catch (error) {
    console.error('Update admin error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Delete admin
// @route   DELETE /api/admins/:id
// @access  Private (super_admin)
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return errorResponse(res, 'Admin not found', 404);
    }

    // Prevent deleting yourself
    if (admin._id.toString() === req.admin._id.toString()) {
      return errorResponse(res, 'Cannot delete your own account', 400);
    }

    // Prevent deleting the last super_admin
    if (admin.role === 'super_admin') {
      const superAdminCount = await Admin.countDocuments({ role: 'super_admin' });
      if (superAdminCount <= 1) {
        return errorResponse(res, 'Cannot delete the last super admin', 400);
      }
    }

    await admin.deleteOne();

    return successResponse(res, null, 'Admin deleted successfully');
  } catch (error) {
    console.error('Delete admin error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Reset admin password
// @route   PUT /api/admins/:id/reset-password
// @access  Private (super_admin)
export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return errorResponse(res, 'Password must be at least 8 characters', 400);
    }

    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return errorResponse(res, 'Admin not found', 404);
    }

    admin.password = newPassword;
    admin.loginAttempts = 0;
    admin.lockUntil = undefined;

    await admin.save();

    return successResponse(res, null, 'Password reset successfully');
  } catch (error) {
    console.error('Reset password error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

export default {
  getAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  resetPassword
};