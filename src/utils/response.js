/**
 * Standard API response format
 */

// Success response
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Error response
export const errorResponse = (res, message = 'Error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    error: message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// Paginated response
export const paginatedResponse = (res, data, page, limit, total, message = 'Success') => {
  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
};

// Created response
export const createdResponse = (res, data, message = 'Resource created successfully') => {
  return res.status(201).json({
    success: true,
    message,
    data
  });
};

// No content response
export const noContentResponse = (res) => {
  return res.status(204).send();
};

// Not found response
export const notFoundResponse = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    error: message
  });
};

// Unauthorized response
export const unauthorizedResponse = (res, message = 'Unauthorized') => {
  return res.status(401).json({
    success: false,
    error: message
  });
};

// Forbidden response
export const forbiddenResponse = (res, message = 'Forbidden') => {
  return res.status(403).json({
    success: false,
    error: message
  });
};

// Bad request response
export const badRequestResponse = (res, message = 'Bad request', errors = null) => {
  const response = {
    success: false,
    error: message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(400).json(response);
};

export default {
  successResponse,
  errorResponse,
  paginatedResponse,
  createdResponse,
  noContentResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  badRequestResponse
};