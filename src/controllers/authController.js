import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { successResponse, errorResponse, unauthorizedResponse } from '../utils/response.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return errorResponse(res, 'Please provide email and password', 400);
    }

    // Find admin
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

    if (!admin) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Check if account is locked
    if (admin.isLocked()) {
      return errorResponse(res, 'Account is temporarily locked due to too many failed login attempts. Please try again later.', 423);
    }

    // Check if account is active
    if (!admin.isActive) {
      return errorResponse(res, 'Account has been deactivated', 401);
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      // Increment login attempts
      await admin.incLoginAttempts();
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Reset login attempts on successful login
    await admin.resetLoginAttempts();

    // Generate token
    const token = generateToken(admin._id);

    // Return success
    return successResponse(res, {
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    }, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Server error during login', 500);
  }
};

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return unauthorizedResponse(res, 'Admin not found');
    }

    return successResponse(res, admin, 'Admin profile retrieved successfully');
  } catch (error) {
    console.error('Get me error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Update admin profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return errorResponse(res, 'Admin not found', 404);
    }

    if (name) {
      admin.name = name;
    }

    await admin.save();

    return successResponse(res, admin, 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 'Please provide current and new password', 400);
    }

    if (newPassword.length < 8) {
      return errorResponse(res, 'New password must be at least 8 characters', 400);
    }

    const admin = await Admin.findById(req.admin.id).select('+password');

    if (!admin) {
      return errorResponse(res, 'Admin not found', 404);
    }

    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword);

    if (!isMatch) {
      return errorResponse(res, 'Current password is incorrect', 401);
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    return successResponse(res, null, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Logout admin (client-side clears token)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  return successResponse(res, null, 'Logged out successfully');
};

// @desc    Verify token validity
// @route   GET /api/auth/verify
// @access  Private
export const verifyToken = async (req, res) => {
  try {
    // If middleware passed, token is valid
    return successResponse(res, {
      valid: true,
      admin: {
        id: req.admin._id,
        email: req.admin.email,
        name: req.admin.name,
        role: req.admin.role
      }
    }, 'Token is valid');
  } catch (error) {
    return errorResponse(res, 'Server error', 500);
  }
};

export default {
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  verifyToken
};