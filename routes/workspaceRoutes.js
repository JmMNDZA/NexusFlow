const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllWorkspaces,
  getWorkspaceById,
  getUserWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addMemberToWorkspace,
  removeMemberFromWorkspace
} = require('../controllers/workspaceController');
const {
  validateWorkspaceCreation,
  validateWorkspaceUpdate,
  validateWorkspaceId
} = require('../middleware/validation');

// GET all workspaces
router.get('/', getAllWorkspaces);

// GET user's workspaces (protected)
router.get('/user/my-workspaces', protect, getUserWorkspaces);

// GET a single workspace
router.get('/:id', validateWorkspaceId, getWorkspaceById);

// CREATE a new workspace (protected)
router.post('/', protect, validateWorkspaceCreation, createWorkspace);

// UPDATE a workspace (protected)
router.put('/:id', protect, validateWorkspaceUpdate, updateWorkspace);

// DELETE a workspace (protected)
router.delete('/:id', protect, validateWorkspaceId, deleteWorkspace);

// ADD member to workspace (protected)
router.post('/:id/members/add', protect, validateWorkspaceId, addMemberToWorkspace);

// REMOVE member from workspace (protected)
router.post('/:id/members/remove', protect, validateWorkspaceId, removeMemberFromWorkspace);

module.exports = router;
