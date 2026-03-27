import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get admin from token
      const admin = await Admin.findById(decoded.id);

      if (!admin) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to access this route. Admin not found.'
        });
      }

      if (!admin.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Account has been deactivated.'
        });
      }

      // Check if account is locked
      if (admin.isLocked()) {
        return res.status(401).json({
          success: false,
          error: 'Account is temporarily locked due to too many failed login attempts.'
        });
      }

      req.admin = admin;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route. Invalid token.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server error during authentication.'
    });
  }
};

// Check if user is super_admin
export const superAdminOnly = (req, res, next) => {
  if (req.admin && req.admin.role === 'super_admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Not authorized. Super admin access required.'
    });
  }
};

// Check if user is editor or above
export const editorOrAbove = (req, res, next) => {
  if (req.admin && (req.admin.role === 'super_admin' || req.admin.role === 'editor')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Not authorized. Editor or admin access required.'
    });
  }
};

// Optional auth - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id);

        if (admin && admin.isActive && !admin.isLocked()) {
          req.admin = admin;
        }
      } catch (error) {
        // Token invalid, but continue without auth
        console.warn('Invalid token in optional auth:', error.message);
      }
    }

    next();
  } catch (error) {
    next();
  }
};

export default { protect, superAdminOnly, editorOrAbove, optionalAuth };