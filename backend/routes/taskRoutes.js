const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); 
const {
    getTasks,
    getTaskById,
    getTasksByProject,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController');
const {
    validateTaskCreation,
    validateTaskUpdate,
    validateTaskId,
    validateTasksByProjectId
} = require('../middleware/validation');

router.route('/')
    .get(protect, getTasks)
    .post(protect, validateTaskCreation, createTask);

router.get('/project/:projectId', protect, validateTasksByProjectId, getTasksByProject);

router.route('/:id')
    .get(protect, validateTaskId, getTaskById)
    .put(protect, validateTaskId, validateTaskUpdate, updateTask)
    .delete(protect, validateTaskId, deleteTask);

module.exports = router;