const Workspace = require('../models/Workspace');

// @desc    Create a new workspace
// @route   POST /api/v1/workspaces
// @access  Private
const createWorkspace = async (req, res) => {
    try {
        const { name, description, owner } = req.body;

        const workspace = await Workspace.create({
            name,
            description,
            owner: owner || req.user._id // Fallback to current authenticated user if not sent explicitly
        });

        res.status(201).json({ message: 'Workspace created successfully', workspace });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all workspaces
// @route   GET /api/v1/workspaces
// @access  Public
const getWorkspaces = async (req, res) => {
    try {
        const workspaces = await Workspace.find({});
        res.status(200).json(workspaces);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get a single workspace by ID
// @route   GET /api/v1/workspaces/:id
// @access  Public
const getWorkspaceById = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id);
        
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }
        
        res.status(200).json(workspace);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a workspace
// @route   PUT /api/v1/workspaces/:id
// @access  Private
const updateWorkspace = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        let workspace = await Workspace.findById(req.params.id);
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        workspace.name = name || workspace.name;
        workspace.description = description || workspace.description;

        const updatedWorkspace = await workspace.save();
        res.status(200).json({ message: 'Workspace updated successfully', updatedWorkspace });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a workspace
// @route   DELETE /api/v1/workspaces/:id
// @access  Private
const deleteWorkspace = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id);
        
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        await workspace.deleteOne();
        res.status(200).json({ message: 'Workspace removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// CRITICAL: Ensure these names match the ones imported in workspaceRoutes.js perfectly!
module.exports = {
    createWorkspace,
    getWorkspaces,
    getWorkspaceById,
    updateWorkspace,
    deleteWorkspace
};