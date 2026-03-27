import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Validate request against express-validator rules
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg
      }))
    });
  }

  next();
};

// Sanitize string input (trim whitespace, escape HTML)
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim();
};

// Validate MongoDB ObjectId
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Validate pagination parameters
export const validatePagination = (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;

  req.query.page = parseInt(page, 10) || 1;
  req.query.limit = Math.min(parseInt(limit, 10) || 20, 100); // Max 100

  next();
};

export default { validate, sanitizeString, isValidObjectId, validatePagination };