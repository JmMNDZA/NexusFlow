const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['todo', 'in-progress', 'completed'], 
    default: 'todo' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium' 
  },
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  dueDate: { 
    type: Date 
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);