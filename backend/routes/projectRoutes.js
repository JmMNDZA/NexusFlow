const express = require('express');
const router = express.Router();
// Changed 'authMiddleware' to 'auth' to match standard naming
const { protect } = require('../middleware/auth'); 
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const {
  validateProjectCreation,
  validateProjectUpdate,
  validateProjectId
} = require('../middleware/validation');

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 */
router.get('/', getAllProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get a single project
 *     tags: [Projects]
 */
router.get('/:id', validateProjectId, getProjectById);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 */
router.post('/', protect, validateProjectCreation, createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 */
router.put('/:id', protect, validateProjectUpdate, updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 */
router.delete('/:id', protect, validateProjectId, deleteProject);

module.exports = router;