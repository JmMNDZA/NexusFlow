const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).populate('owner', 'name email');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new project
const createProject = async (req, res) => {
  const { title, description, owner } = req.body;
  try {
    const user = await User.findById(owner);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role !== 'Project Manager') {
      return res.status(403).json({ message: 'Access denied. Only Project Managers can create projects.' });
    }

    // Explicitly generate projectCode before creation
    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const project = await Project.create({ 
      title, 
      description, 
      owner,
      projectCode: generatedCode 
    });

    res.status(201).json({ 
      message: 'Project created successfully!', 
      projectCode: project.projectCode, 
      project 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};