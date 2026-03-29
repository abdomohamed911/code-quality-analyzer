/**
 * Unit tests for Task Service
 */

const taskService = require('../../src/services/taskService');

describe('Task Service', () => {
  beforeEach(() => {
    // Clear the store before each test
    const store = require('../../src/services/taskService');
    // Reset by creating fresh instances
  });
  
  describe('create', () => {
    it('should create a task with valid data', () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test description',
        priority: 'high'
      };
      
      const task = taskService.create(taskData);
      
      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(task.title).toBe('Test Task');
      expect(task.status).toBe('pending');
      expect(task.priority).toBe('high');
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });
    
    it('should throw error for missing title', () => {
      expect(() => taskService.create({})).toThrow('Title is required');
    });
    
    it('should throw error for invalid priority', () => {
      expect(() => taskService.create({ 
        title: 'Test',
        priority: 'invalid' 
      })).toThrow('Invalid priority');
    });
    
    it('should set default values', () => {
      const task = taskService.create({ title: 'Test' });
      
      expect(task.status).toBe('pending');
      expect(task.priority).toBe('medium');
      expect(task.tags).toEqual([]);
    });
  });
  
  describe('findById', () => {
    it('should return task when found', () => {
      const created = taskService.create({ title: 'Find Me' });
      const found = taskService.findById(created.id);
      
      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.title).toBe('Find Me');
    });
    
    it('should return null when not found', () => {
      const found = taskService.findById('non-existent-id');
      
      expect(found).toBeNull();
    });
  });
  
  describe('update', () => {
    it('should update existing task', () => {
      const created = taskService.create({ title: 'Original' });
      const updated = taskService.update(created.id, { 
        title: 'Updated',
        status: 'completed'
      });
      
      expect(updated.title).toBe('Updated');
      expect(updated.status).toBe('completed');
      expect(updated.id).toBe(created.id);
      expect(updated.createdAt).toBe(created.createdAt);
    });
    
    it('should return null for non-existent task', () => {
      const result = taskService.update('non-existent', { title: 'Test' });
      
      expect(result).toBeNull();
    });
    
    it('should not allow ID modification', () => {
      const created = taskService.create({ title: 'Test' });
      const updated = taskService.update(created.id, { id: 'new-id' });
      
      expect(updated.id).toBe(created.id);
    });
  });
  
  describe('remove', () => {
    it('should delete existing task', () => {
      const created = taskService.create({ title: 'Delete Me' });
      const deleted = taskService.remove(created.id);
      
      expect(deleted).toBe(true);
      expect(taskService.findById(created.id)).toBeNull();
    });
    
    it('should return false for non-existent task', () => {
      const deleted = taskService.remove('non-existent');
      
      expect(deleted).toBe(false);
    });
  });
  
  describe('findAll', () => {
    beforeEach(() => {
      taskService.create({ title: 'Task 1', status: 'pending', priority: 'high' });
      taskService.create({ title: 'Task 2', status: 'completed', priority: 'low' });
      taskService.create({ title: 'Task 3', status: 'pending', priority: 'medium' });
    });
    
    it('should return all tasks', () => {
      const result = taskService.findAll();
      
      expect(result.tasks.length).toBe(3);
    });
    
    it('should filter by status', () => {
      const result = taskService.findAll({ status: 'pending' });
      
      expect(result.tasks.length).toBe(2);
      result.tasks.forEach(task => {
        expect(task.status).toBe('pending');
      });
    });
    
    it('should filter by priority', () => {
      const result = taskService.findAll({ priority: 'high' });
      
      expect(result.tasks.length).toBe(1);
      expect(result.tasks[0].priority).toBe('high');
    });
    
    it('should paginate results', () => {
      const result = taskService.findAll({}, { page: 1, limit: 2 });
      
      expect(result.tasks.length).toBe(2);
      expect(result.pagination.totalItems).toBe(3);
      expect(result.pagination.totalPages).toBe(2);
      expect(result.pagination.hasNextPage).toBe(true);
    });
  });
});