/**
 * Error Handling Middleware
 */

const ApiError = require('../utils/ApiError');

/**
 * Global error handler
 */
function errorHandler(err, req, res, next) {
  // Handle known API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
  }
  
  // Handle validation errors
  if (err.name === 'ValidationError' || err.message.includes('required') || err.message.includes('Invalid')) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message
      }
    });
  }
  
  // Handle unexpected errors
  console.error('Unexpected error:', err);
  
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
}

module.exports = { errorHandler };