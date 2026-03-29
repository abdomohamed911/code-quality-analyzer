/**
 * Example of well-structured, documented code
 * This file demonstrates best practices for code quality
 */

/**
 * Custom error class for validation failures
 */
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * User service class for managing user operations
 */
class UserService {
  constructor(userRepository, logger) {
    this.userRepository = userRepository;
    this.logger = logger;
  }

  /**
   * Fetches a user by their unique identifier
   * @param {string} userId - The unique user identifier
   * @returns {Promise<Object>} The user object
   * @throws {NotFoundError} If user is not found
   * @throws {DatabaseError} If database operation fails
   */
  async getUserById(userId) {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new ValidationError('User ID must be a non-empty string', 'userId');
      }

      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        throw new NotFoundError(`User not found with ID: ${userId}`);
      }

      return this.sanitizeUser(user);
    } catch (error) {
      this.logger.error('Failed to fetch user', { userId, error: error.message });
      
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      
      throw new DatabaseError('Failed to fetch user', { cause: error });
    }
  }

  /**
   * Sanitizes user object by removing sensitive fields
   * @param {Object} user - Raw user object
   * @returns {Object} Sanitized user object
   */
  sanitizeUser(user) {
    const { password, ssn, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

/**
 * Validates email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Formats a date to readable string
 * @param {Date|string} date - Date to format
 * @param {string} format - Output format ('short', 'long', 'iso')
 * @returns {string} Formatted date string
 */
function formatDate(date, format = 'short') {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }

  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
    iso: undefined
  };

  return dateObj.toLocaleDateString('en-US', options[format]);
}

module.exports = { UserService, ValidationError, isValidEmail, formatDate };