const { body, query, param, validationResult } = require('express-validator');

// Validation result handler - catches and returns validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation errors', 
      errors: errors.array() 
    });
  }
  next();
};

// User validation
const validateUserRegistration = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
    // Optional: Uncomment these later if your professor requires production-level password security:
    // .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    // .matches(/[0-9]/).withMessage('Password must contain a number')
    // .matches(/[!@#$%^&*]/).withMessage('Password must contain a special character'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

// Project validation
const validateProjectCreation = [
  body('title').trim().notEmpty().withMessage('Project title is required'),
  body('description').optional().trim(),
  body('owner').isMongoId().withMessage('Valid owner ID is required'),
  handleValidationErrors
];

const validateProjectUpdate = [
  param('id').isMongoId().withMessage('Valid project ID is required'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim(),
  body('status').optional().isIn(['active', 'completed', 'archived']).withMessage('Invalid status'),
  handleValidationErrors
];

const validateProjectId = [
  param('id').isMongoId().withMessage('Valid project ID is required'),
  handleValidationErrors
];

// Task validation
const validateTaskCreation = [
  body('projectId').isMongoId().withMessage('Valid project ID is required'),
  body('taskName').trim().notEmpty().withMessage('Task name is required'),
  body('assignedTo').optional().isMongoId().withMessage('Valid user ID required'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority level'),
  body('dueDate').optional().isISO8601().withMessage('Valid date is required'),
  body('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status'),
  handleValidationErrors
];

const validateTaskUpdate = [
  param('id').isMongoId().withMessage('Valid task ID is required'),
  body('taskName').optional().trim().notEmpty().withMessage('Task name cannot be empty'),
  body('assignedTo').optional().isMongoId().withMessage('Valid user ID required'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority level'),
  body('dueDate').optional().isISO8601().withMessage('Valid date is required'),
  body('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status'),
  handleValidationErrors
];

const validateTaskId = [
  param('id').isMongoId().withMessage('Valid task ID is required'),
  handleValidationErrors
];

const validateTasksByProjectId = [
  param('projectId').isMongoId().withMessage('Valid project ID is required'),
  handleValidationErrors
];

// Comment validation
const validateCommentCreation = [
  body('taskId').isMongoId().withMessage('Valid task ID is required'),
  body('content').trim().notEmpty().withMessage('Comment content is required'),
  body('mentionedUsers').optional().isArray().withMessage('Mentioned users must be an array'),
  handleValidationErrors
];

const validateCommentUpdate = [
  param('id').isMongoId().withMessage('Valid comment ID is required'),
  body('content').trim().notEmpty().withMessage('Comment content is required'),
  body('mentionedUsers').optional().isArray().withMessage('Mentioned users must be an array'),
  handleValidationErrors
];

const validateCommentId = [
  param('id').isMongoId().withMessage('Valid comment ID is required'),
  handleValidationErrors
];

const validateCommentsByTaskId = [
  param('taskId').isMongoId().withMessage('Valid task ID is required'),
  handleValidationErrors
];

// Attachment validation
const validateAttachmentCreation = [
  body('taskId').isMongoId().withMessage('Valid task ID is required'),
  body('fileName').trim().notEmpty().withMessage('File name is required'),
  body('fileUrl').isURL().withMessage('Valid file URL is required'),
  body('fileType').trim().notEmpty().withMessage('File type is required'),
  handleValidationErrors
];

const validateAttachmentId = [
  param('id').isMongoId().withMessage('Valid attachment ID is required'),
  handleValidationErrors
];

const validateAttachmentsByTaskId = [
  param('taskId').isMongoId().withMessage('Valid task ID is required'),
  handleValidationErrors
];

// Workspace validation
const validateWorkspaceCreation = [
  body('name').trim().notEmpty().withMessage('Workspace name is required'),
  body('description').optional().trim(),
  body('owner').optional().isMongoId().withMessage('Valid owner ID is required'),
  handleValidationErrors
];

const validateWorkspaceUpdate = [
  param('id').isMongoId().withMessage('Valid workspace ID is required'),
  body('name').optional().trim().notEmpty().withMessage('Workspace name cannot be empty'),
  body('description').optional().trim(),
  handleValidationErrors
];

const validateWorkspaceId = [
  param('id').isMongoId().withMessage('Valid workspace ID is required'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateProjectCreation,
  validateProjectUpdate,
  validateProjectId,
  validateTaskCreation,
  validateTaskUpdate,
  validateTaskId,
  validateTasksByProjectId,
  validateCommentCreation,
  validateCommentUpdate,
  validateCommentId,
  validateCommentsByTaskId,
  validateAttachmentCreation,
  validateAttachmentId,
  validateAttachmentsByTaskId,
  validateWorkspaceCreation,
  validateWorkspaceUpdate,
  validateWorkspaceId
};