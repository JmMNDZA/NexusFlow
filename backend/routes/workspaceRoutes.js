const express = require('express');
const router = express.Router(); // CRITICAL: This fixes the ReferenceError!

// Import your controller functions
const {
    createWorkspace,
    getWorkspaces,
    getWorkspaceById,
    updateWorkspace,
    deleteWorkspace
} = require('../controllers/workspaceController');

// Import your middlewares
const { protect } = require('../middleware/auth');
const {
    validateWorkspaceCreation,
    validateWorkspaceUpdate,
    validateWorkspaceId
} = require('../middleware/validation');

// --- CRUD ENDPOINTS FOR WORKSPACES ---

// 1. CREATE a new workspace (Protected)
router.post('/', protect, validateWorkspaceCreation, createWorkspace);

// 2. READ all workspaces (Can be public or protected depending on requirement)
router.get('/', getWorkspaces);

// 3. READ a single workspace by its ID
router.get('/:id', validateWorkspaceId, getWorkspaceById);

// 4. UPDATE a workspace by its ID (Protected)
router.put('/:id', protect, validateWorkspaceId, validateWorkspaceUpdate, updateWorkspace);

// 5. DELETE a workspace by its ID (Protected)
router.delete('/:id', protect, validateWorkspaceId, deleteWorkspace);

// Make absolutely sure this line stays direct and clear!
module.exports = router;