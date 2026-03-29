class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class UserService {
  constructor(userRepository, logger) {
    this.userRepository = userRepository;
    this.logger = logger;
  }

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

  sanitizeUser(user) {
    const { password, ssn, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

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
