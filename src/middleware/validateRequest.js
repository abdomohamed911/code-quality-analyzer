const ApiError = require('../utils/ApiError');

function validateTask(req, res, next) {
  const { title, description, priority, status, dueDate, tags } = req.body;
  
  const errors = [];
  
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }
  
  if (title && title.length > 200) {
    errors.push('Title must not exceed 200 characters');
  }
  
  if (description && typeof description !== 'string') {
    errors.push('Description must be a string');
  }
  
  const validPriorities = ['low', 'medium', 'high'];
  if (priority && !validPriorities.includes(priority)) {
    errors.push(`Priority must be one of: ${validPriorities.join(', ')}`);
  }
  
  const validStatuses = ['pending', 'in-progress', 'completed'];
  if (status && !validStatuses.includes(status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }
  
  if (dueDate && isNaN(new Date(dueDate).getTime())) {
    errors.push('Invalid due date format');
  }
  
  if (tags && !Array.isArray(tags)) {
    errors.push('Tags must be an array');
  }
  
  if (errors.length > 0) {
    throw new ApiError(400, 'Validation failed', { errors });
  }
  
  next();
}

function validateTaskUpdate(req, res, next) {
  const { title, description, priority, status, dueDate, tags } = req.body;
  
  // Allow partial updates - only validate provided fields
  const errors = [];
  
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Title must be a non-empty string');
    }
    if (title.length > 200) {
      errors.push('Title must not exceed 200 characters');
    }
  }
  
  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string');
  }
  
  const validPriorities = ['low', 'medium', 'high'];
  if (priority !== undefined && !validPriorities.includes(priority)) {
    errors.push(`Priority must be one of: ${validPriorities.join(', ')}`);
  }
  
  const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
  if (status !== undefined && !validStatuses.includes(status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }
  
  if (dueDate !== undefined && dueDate !== null && isNaN(new Date(dueDate).getTime())) {
    errors.push('Invalid due date format');
  }
  
  if (tags !== undefined && !Array.isArray(tags)) {
    errors.push('Tags must be an array');
  }
  
  if (errors.length > 0) {
    throw new ApiError(400, 'Validation failed', { errors });
  }
  
  next();
}

module.exports = { validateTask, validateTaskUpdate };
