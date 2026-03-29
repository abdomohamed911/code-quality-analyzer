const taskService = require('../services/taskService');
const ApiError = require('../utils/ApiError');

async function getAllTasks(req, res, next) {
  try {
    const { status, priority, sort, page = '1', limit = '10' } = req.query;
    
    const filters = {
      status,
      priority
    };
    
    const options = {
      sort: sort || 'createdAt',
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    };
    
    const result = await taskService.findAll(filters, options);
    
    res.json({
      success: true,
      data: result.tasks,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
}

async function getTaskById(req, res, next) {
  try {
    const { id } = req.params;
    const task = await taskService.findById(id);
    
    if (!task) {
      throw new ApiError(404, 'Task not found', { taskId: id });
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const taskData = req.body;
    const task = await taskService.create(taskData);
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const task = await taskService.update(id, updateData);
    
    if (!task) {
      throw new ApiError(404, 'Task not found', { taskId: id });
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await taskService.remove(id);
    
    if (!deleted) {
      throw new ApiError(404, 'Task not found', { taskId: id });
    }
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
