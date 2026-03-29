/**
 * Integration tests for Task API endpoints
 */

const request = require('supertest');
const app = require('../../src/app');

describe('Task API Integration Tests', () => {
  describe('POST /api/v1/tasks', () => {
    it('should create a new task with valid data', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({
          title: 'Integration Test Task',
          description: 'Created by integration test',
          priority: 'high'
        })
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Integration Test Task');
      expect(response.body.data.id).toBeDefined();
    });
    
    it('should return 400 for missing title', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({ description: 'No title' })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
    
    it('should return 400 for invalid priority', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({
          title: 'Test',
          priority: 'urgent'
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('GET /api/v1/tasks', () => {
    it('should return list of tasks', async () => {
      // Create a task first
      await request(app)
        .post('/api/v1/tasks')
        .send({ title: 'List Test Task' });
      
      const response = await request(app)
        .get('/api/v1/tasks')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toBeDefined();
    });
    
    it('should filter by status', async () => {
      const response = await request(app)
        .get('/api/v1/tasks?status=pending')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      response.body.data.forEach(task => {
        expect(task.status).toBe('pending');
      });
    });
    
    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/v1/tasks?page=1&limit=5')
        .expect(200);
      
      expect(response.body.pagination.limit).toBe(5);
      expect(response.body.pagination.page).toBe(1);
    });
  });
  
  describe('GET /api/v1/tasks/:id', () => {
    it('should return task by ID', async () => {
      // Create a task
      const created = await request(app)
        .post('/api/v1/tasks')
        .send({ title: 'Get By ID Test' });
      
      const taskId = created.body.data.id;
      
      const response = await request(app)
        .get(`/api/v1/tasks/${taskId}`)
        .expect(200);
      
      expect(response.body.data.id).toBe(taskId);
      expect(response.body.data.title).toBe('Get By ID Test');
    });
    
    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .get('/api/v1/tasks/non-existent-id')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });
  
  describe('PUT /api/v1/tasks/:id', () => {
    it('should update task', async () => {
      const created = await request(app)
        .post('/api/v1/tasks')
        .send({ title: 'Original Title' });
      
      const taskId = created.body.data.id;
      
      const response = await request(app)
        .put(`/api/v1/tasks/${taskId}`)
        .send({ title: 'Updated Title', status: 'completed' })
        .expect(200);
      
      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.status).toBe('completed');
    });
    
    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .put('/api/v1/tasks/non-existent-id')
        .send({ title: 'Test' })
        .expect(404);
      
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('DELETE /api/v1/tasks/:id', () => {
    it('should delete task', async () => {
      const created = await request(app)
        .post('/api/v1/tasks')
        .send({ title: 'Delete Me' });
      
      const taskId = created.body.data.id;
      
      await request(app)
        .delete(`/api/v1/tasks/${taskId}`)
        .expect(200);
      
      // Verify it's deleted
      await request(app)
        .get(`/api/v1/tasks/${taskId}`)
        .expect(404);
    });
    
    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .delete('/api/v1/tasks/non-existent-id')
        .expect(404);
      
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.status).toBe('healthy');
    });
  });
});