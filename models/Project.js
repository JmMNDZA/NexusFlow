const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // This links the project to the person who created it
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'archived'], 
    default: 'active' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);