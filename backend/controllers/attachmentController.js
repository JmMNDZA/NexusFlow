const Attachment = require('../models/Attachment');
const Task = require('../models/Task');

// GET all attachments for a task
const getAttachmentsByTask = async (req, res) => {
  try {
    const attachments = await Attachment.find({ taskId: req.params.taskId })
      .populate('uploadedBy', 'name email');
    
    if (attachments.length === 0) {
      return res.json({ message: 'No attachments found for this task', attachments: [] });
    }
    
    res.json(attachments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET a single attachment by ID
const getAttachmentById = async (req, res) => {
  try {
    const attachment = await Attachment.findById(req.params.id)
      .populate('uploadedBy', 'name email');
    
    if (!attachment) {
      return res.status(404).json({ message: 'Attachment not found' });
    }
    
    res.json(attachment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CREATE a new attachment
const createAttachment = async (req, res) => {
  const { taskId, fileName, fileUrl, fileType, fileSize } = req.body;
  
  try {
    // Verify task exists
    const taskExists = await Task.findById(taskId);
    if (!taskExists) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const attachment = await Attachment.create({
      taskId,
      fileName,
      fileUrl,
      fileType,
      uploadedBy: req.user._id,
      fileSize: fileSize || 0
    });

    const populatedAttachment = await attachment.populate('uploadedBy', 'name email');

    res.status(201).json({ message: 'Attachment created successfully!', attachment: populatedAttachment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE an attachment
const updateAttachment = async (req, res) => {
  const { fileName, fileUrl, fileType, fileSize } = req.body;
  
  try {
    const attachment = await Attachment.findById(req.params.id);
    
    if (!attachment) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    // Verify the user uploaded the attachment
    if (attachment.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this attachment' });
    }

    const updatedAttachment = await Attachment.findByIdAndUpdate(
      req.params.id,
      { fileName, fileUrl, fileType, fileSize },
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'name email');

    res.json({ message: 'Attachment updated successfully!', attachment: updatedAttachment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE an attachment
const deleteAttachment = async (req, res) => {
  try {
    const attachment = await Attachment.findById(req.params.id);
    
    if (!attachment) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    // Verify the user uploaded the attachment
    if (attachment.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this attachment' });
    }

    await Attachment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attachment deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAttachmentsByTask,
  getAttachmentById,
  createAttachment,
  updateAttachment,
  deleteAttachment
};
