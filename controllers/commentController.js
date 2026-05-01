const Comment = require('../models/Comment');
const Task = require('../models/Task');
const User = require('../models/User');

// GET all comments for a task
const getCommentsByTask = async (req, res) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId })
      .populate('author', 'name email')
      .populate('mentionedUsers', 'name email')
      .populate('attachments')
      .sort({ createdAt: -1 });
    
    if (comments.length === 0) {
      return res.json({ message: 'No comments found for this task', comments: [] });
    }
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET a single comment by ID
const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('author', 'name email')
      .populate('mentionedUsers', 'name email')
      .populate('attachments');
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CREATE a new comment
const createComment = async (req, res) => {
  const { taskId, content, mentionedUsers } = req.body;
  
  try {
    // Verify task exists
    const taskExists = await Task.findById(taskId);
    if (!taskExists) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify mentioned users exist (if provided)
    if (mentionedUsers && mentionedUsers.length > 0) {
      for (let userId of mentionedUsers) {
        const userExists = await User.findById(userId);
        if (!userExists) {
          return res.status(404).json({ message: `User ${userId} not found` });
        }
      }
    }

    const comment = await Comment.create({
      taskId,
      author: req.user._id,
      content,
      mentionedUsers: mentionedUsers || []
    });

    const populatedComment = await comment.populate([
      { path: 'author', select: 'name email' },
      { path: 'mentionedUsers', select: 'name email' }
    ]);

    res.status(201).json({ message: 'Comment created successfully!', comment: populatedComment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE a comment
const updateComment = async (req, res) => {
  const { content, mentionedUsers } = req.body;
  
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Verify the user is the comment author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    // Verify mentioned users exist (if provided)
    if (mentionedUsers && mentionedUsers.length > 0) {
      for (let userId of mentionedUsers) {
        const userExists = await User.findById(userId);
        if (!userExists) {
          return res.status(404).json({ message: `User ${userId} not found` });
        }
      }
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content, mentionedUsers },
      { new: true, runValidators: true }
    ).populate([
      { path: 'author', select: 'name email' },
      { path: 'mentionedUsers', select: 'name email' }
    ]);

    res.json({ message: 'Comment updated successfully!', comment: updatedComment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE a comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Verify the user is the comment author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getCommentsByTask,
  getCommentById,
  createComment,
  updateComment,
  deleteComment
};
