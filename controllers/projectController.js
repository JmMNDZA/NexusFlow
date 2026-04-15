const Project = require('../models/Project');
const User = require('../models/User');

// GET all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('owner', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET a single project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner', 'name email');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CREATE a new project
const createProject = async (req, res) => {
  const { title, description, owner } = req.body;
  try {
    // Verify owner exists
    const ownerExists = await User.findById(owner);
    if (!ownerExists) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    const project = await Project.create({
      title,
      description,
      owner
    });

    const populatedProject = await project.populate('owner', 'name email');
    res.status(201).json({ message: 'Project created successfully!', project: populatedProject });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE a project
const updateProject = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, status },
      { new: true, runValidators: true }
    ).populate('owner', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project updated successfully!', project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE a project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully!' });
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
