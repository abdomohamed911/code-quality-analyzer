const { v4: uuidv4 } = require('uuid');
const Task = require('../models/Task');
const { paginate } = require('../utils/pagination');

// In-memory storage (would be database in production)
const taskStore = new Map();

function findAll(filters = {}, options = {}) {
  let tasks = Array.from(taskStore.values());
  
  // Apply filters
  if (filters.status) {
    tasks = tasks.filter(task => task.status === filters.status);
  }
  
  if (filters.priority) {
    tasks = tasks.filter(task => task.priority === filters.priority);
  }
  
  // Apply sorting
  const sortField = options.sort || 'createdAt';
  const sortOrder = options.order || 'desc';
  
  tasks.sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Apply pagination
  const { page, limit } = options;
  const paginatedResult = paginate(tasks, page, limit);
  
  return {
    tasks: paginatedResult.data,
    pagination: paginatedResult.pagination
  };
}

function findById(id) {
  return taskStore.get(id) || null;
}

function create(taskData) {
  const task = new Task({
    id: uuidv4(),
    ...taskData,
    status: taskData.status || 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  
  taskStore.set(task.id, task);
  return task;
}

function update(id, updateData) {
  const existingTask = taskStore.get(id);
  
  if (!existingTask) {
    return null;
  }
  
  const updatedTask = {
    ...existingTask,
    ...updateData,
    id: existingTask.id, // Prevent ID modification
    createdAt: existingTask.createdAt, // Prevent createdAt modification
    updatedAt: new Date().toISOString()
  };
  
  taskStore.set(id, updatedTask);
  return updatedTask;
}

function remove(id) {
  return taskStore.delete(id);
}

function getStatistics() {
  const tasks = Array.from(taskStore.values());
  
  return {
    total: tasks.length,
    byStatus: {
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length
    },
    byPriority: {
      low: tasks.filter(t => t.priority === 'low').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      high: tasks.filter(t => t.priority === 'high').length
    }
  };
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  getStatistics
};
