/**
 * User and data validation module
 */

const ValidationError = require('./ValidationError');

/**
 * Creates a new user with validation
 * @param {Object} userData - User creation data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {number} userData.age - User's age
 * @param {string} [userData.role] - User's role (default: 'user')
 * @returns {Object} Created user object
 * @throws {ValidationError} If validation fails
 */
function createUser(userData) {
  // Validate input exists
  if (!userData || typeof userData !== 'object') {
    throw new ValidationError('User data must be an object');
  }
  
  const { name, email, age, role } = userData;
  
  // Validate name
  if (!name || typeof name !== 'string') {
    throw new ValidationError('Name is required and must be a string', 'name');
  }
  if (name.trim().length < 2) {
    throw new ValidationError('Name must be at least 2 characters', 'name');
  }
  if (name.length > 100) {
    throw new ValidationError('Name must not exceed 100 characters', 'name');
  }
  
  // Validate email
  if (!email || typeof email !== 'string') {
    throw new ValidationError('Email is required and must be a string', 'email');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format', 'email');
  }
  
  // Validate age
  if (age === undefined || age === null) {
    throw new ValidationError('Age is required', 'age');
  }
  if (typeof age !== 'number' || !Number.isInteger(age)) {
    throw new ValidationError('Age must be a whole number', 'age');
  }
  if (age < 0 || age > 150) {
    throw new ValidationError('Age must be between 0 and 150', 'age');
  }
  
  // Validate role
  const validRoles = ['user', 'admin', 'moderator'];
  if (role !== undefined && !validRoles.includes(role)) {
    throw new ValidationError(`Role must be one of: ${validRoles.join(', ')}`, 'role');
  }
  
  return {
    id: generateId(),
    name: name.trim(),
    email: email.toLowerCase(),
    age,
    role: role || 'user',
    createdAt: new Date().toISOString()
  };
}

/**
 * Calculates total price with validation
 * @param {Array} items - Array of {price, quantity} objects
 * @param {number} discount - Discount decimal (0-1)
 * @returns {number} Calculated price
 * @throws {ValidationError} If validation fails
 */
function calculatePrice(items, discount) {
  // Validate items
  if (!Array.isArray(items)) {
    throw new ValidationError('Items must be an array');
  }
  
  if (items.length === 0) {
    return 0;
  }
  
  // Validate each item
  items.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new ValidationError(`Item at index ${index} must be an object`);
    }
    if (typeof item.price !== 'number' || item.price < 0) {
      throw new ValidationError(`Item ${index}: price must be a non-negative number`);
    }
    if (typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity < 0) {
      throw new ValidationError(`Item ${index}: quantity must be a non-negative integer`);
    }
  });
  
  // Validate discount
  if (discount === undefined || discount === null) {
    throw new ValidationError('Discount is required');
  }
  if (typeof discount !== 'number') {
    throw new ValidationError('Discount must be a number');
  }
  if (discount < 0 || discount > 1) {
    throw new ValidationError('Discount must be between 0 and 1');
  }
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountedTotal = total * (1 - discount);
  
  return Math.round(discountedTotal * 100) / 100; // Round to 2 decimal places
}

/**
 * Formats date string with validation
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date in MM/DD/YYYY format
 * @throws {ValidationError} If date is invalid
 */
function formatDate(dateString) {
  if (typeof dateString !== 'string') {
    throw new ValidationError('Date must be a string');
  }
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    throw new ValidationError('Date must be in YYYY-MM-DD format');
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new ValidationError('Invalid date');
  }
  
  const [year, month, day] = dateString.split('-');
  return `${month}/${day}/${year}`;
}

/**
 * Searches users with null safety
 * @param {Array} users - Array of user objects
 * @param {string} query - Search query
 * @returns {Array} Matching users
 */
function searchUsers(users, query) {
  if (!Array.isArray(users)) {
    return [];
  }
  
  if (!query || typeof query !== 'string') {
    return [];
  }
  
  const normalizedQuery = query.toLowerCase();
  
  return users.filter(user => {
    if (!user || !user.name) return false;
    return user.name.toLowerCase().includes(normalizedQuery);
  });
}

/**
 * Generates a unique ID
 * @returns {string} Unique identifier
 */
function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

module.exports = {
  createUser,
  calculatePrice,
  formatDate,
  searchUsers
};