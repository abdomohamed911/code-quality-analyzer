/**
 * Task Routes - RESTful endpoints for task management
 * 
 * GET    /tasks          - List all tasks with filtering and pagination
 * GET    /tasks/:id      - Get single task
 * POST   /tasks          - Create new task
 * PUT    /tasks/:id      - Update task
 * DELETE /tasks/:id      - Delete task
 */

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { validateTask, validateTaskUpdate } = require('../middleware/validateRequest');

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', validateTask, taskController.createTask);
router.put('/:id', validateTaskUpdate, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;