const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  // The unique invite code for Team Members/Guests
  projectCode: { 
    type: String, 
    unique: true, 
    required: true,
    default: () => Math.random().toString(36).substring(2, 8).toUpperCase() 
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'active' }
});

module.exports = mongoose.model('Project', projectSchema);