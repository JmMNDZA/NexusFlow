const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAttachmentsByTask,
  getAttachmentById,
  createAttachment,
  updateAttachment,
  deleteAttachment
} = require('../controllers/attachmentController');
const {
  validateAttachmentCreation,
  validateAttachmentId,
  validateAttachmentsByTaskId
} = require('../middleware/validation');

// GET attachments by task
router.get('/task/:taskId', validateAttachmentsByTaskId, getAttachmentsByTask);

// GET a single attachment
router.get('/:id', validateAttachmentId, getAttachmentById);

// CREATE a new attachment (protected)
router.post('/', protect, validateAttachmentCreation, createAttachment);

// UPDATE an attachment (protected)
router.put('/:id', protect, validateAttachmentId, updateAttachment);

// DELETE an attachment (protected)
router.delete('/:id', protect, validateAttachmentId, deleteAttachment);

module.exports = router;
