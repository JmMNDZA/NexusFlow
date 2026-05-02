const Workspace = require('../models/Workspace');
const User = require('../models/User');
const Project = require('../models/Project');

// GET all workspaces
const getAllWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find()
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .populate('projects', 'title');
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET a single workspace by ID
const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .populate('projects', 'title');
    
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET user's workspaces
const getUserWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id }
      ]
    })
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .populate('projects', 'title');
    
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CREATE a new workspace
const createWorkspace = async (req, res) => {
  const { name, description } = req.body;
  try {
    const workspace = await Workspace.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id]
    });

    const populatedWorkspace = await workspace.populate([
      { path: 'owner', select: 'name email' },
      { path: 'members', select: 'name email' }
    ]);

    res.status(201).json({ message: 'Workspace created successfully!', workspace: populatedWorkspace });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE a workspace
const updateWorkspace = async (req, res) => {
  const { name, description, isActive } = req.body;
  try {
    const workspace = await Workspace.findById(req.params.id);
    
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Verify the user is the workspace owner
    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this workspace' });
    }

    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      req.params.id,
      { name, description, isActive },
      { new: true, runValidators: true }
    ).populate([
      { path: 'owner', select: 'name email' },
      { path: 'members', select: 'name email' },
      { path: 'projects', select: 'title' }
    ]);

    res.json({ message: 'Workspace updated successfully!', workspace: updatedWorkspace });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE a workspace
const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Verify the user is the workspace owner
    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this workspace' });
    }

    await Workspace.findByIdAndDelete(req.params.id);
    res.json({ message: 'Workspace deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ADD member to workspace
const addMemberToWorkspace = async (req, res) => {
  const { userId } = req.body;
  try {
    const workspace = await Workspace.findById(req.params.id);
    
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Verify the user is the workspace owner
    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to manage members' });
    }

    // Verify the new member exists
    const memberExists = await User.findById(userId);
    if (!memberExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already a member
    if (workspace.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member of this workspace' });
    }

    workspace.members.push(userId);
    await workspace.save();

    const populatedWorkspace = await workspace.populate([
      { path: 'owner', select: 'name email' },
      { path: 'members', select: 'name email' }
    ]);

    res.json({ message: 'Member added successfully!', workspace: populatedWorkspace });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// REMOVE member from workspace
const removeMemberFromWorkspace = async (req, res) => {
  const { userId } = req.body;
  try {
    const workspace = await Workspace.findById(req.params.id);
    
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Verify the user is the workspace owner
    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to manage members' });
    }

    // Check if user is a member
    if (!workspace.members.includes(userId)) {
      return res.status(400).json({ message: 'User is not a member of this workspace' });
    }

    workspace.members = workspace.members.filter(id => id.toString() !== userId);
    await workspace.save();

    const populatedWorkspace = await workspace.populate([
      { path: 'owner', select: 'name email' },
      { path: 'members', select: 'name email' }
    ]);

    res.json({ message: 'Member removed successfully!', workspace: populatedWorkspace });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllWorkspaces,
  getWorkspaceById,
  getUserWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addMemberToWorkspace,
  removeMemberFromWorkspace
};
