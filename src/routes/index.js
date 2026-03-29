/**
 * Route aggregator
 */

const express = require('express');
const taskRoutes = require('./tasks');

const router = express.Router();

router.use('/tasks', taskRoutes);

module.exports = router;