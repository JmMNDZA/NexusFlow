const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCommentsByTask,
  getCommentById,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');
const {
  validateCommentCreation,
  validateCommentUpdate,
  validateCommentId,
  validateCommentsByTaskId
} = require('../middleware/validation');

// GET comments by task
router.get('/task/:taskId', validateCommentsByTaskId, getCommentsByTask);

// GET a single comment
router.get('/:id', validateCommentId, getCommentById);

// CREATE a new comment (protected)
router.post('/', protect, validateCommentCreation, createComment);

// UPDATE a comment (protected)
router.put('/:id', protect, validateCommentUpdate, updateComment);

// DELETE a comment (protected)
router.delete('/:id', protect, validateCommentId, deleteComment);

module.exports = router;
