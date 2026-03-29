/**
 * Task Model - Represents a task entity
 */

const VALID_STATUSES = ['pending', 'in-progress', 'completed', 'cancelled'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

/**
 * Task class with validation
 */
class Task {
  constructor(data = {}) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description || '';
    this.status = data.status || 'pending';
    this.priority = data.priority || 'medium';
    this.dueDate = data.dueDate || null;
    this.tags = data.tags || [];
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    
    this.validate();
  }
  
  /**
   * Validate task data
   * @throws {Error} If validation fails
   */
  validate() {
    if (!this.title || typeof this.title !== 'string' || this.title.trim().length === 0) {
      throw new Error('Task title is required and must be a non-empty string');
    }
    
    if (this.title.length > 200) {
      throw new Error('Task title must not exceed 200 characters');
    }
    
    if (this.description && this.description.length > 2000) {
      throw new Error('Task description must not exceed 2000 characters');
    }
    
    if (!VALID_STATUSES.includes(this.status)) {
      throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
    }
    
    if (!VALID_PRIORITIES.includes(this.priority)) {
      throw new Error(`Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }
    
    if (this.dueDate && isNaN(new Date(this.dueDate).getTime())) {
      throw new Error('Invalid due date format');
    }
    
    if (!Array.isArray(this.tags)) {
      throw new Error('Tags must be an array');
    }
  }
  
  /**
   * Convert to plain object
   * @returns {Object} Plain task object
   */
  toJSON() {
    return { ...this };
  }
}

module.exports = Task;