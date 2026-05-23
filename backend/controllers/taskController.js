const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate('projectId', 'title')
      .populate('assignedTo', 'name email');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('projectId', 'title')
      .populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all tasks for a given project
const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate('projectId', 'title')
      .populate('assignedTo', 'name email');

    if (tasks.length === 0) {
      return res.status(200).json({ message: 'No tasks found for this project', tasks: [] });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new task
const createTask = async (req, res) => {
  try {
    const { taskName, projectId, assignedTo } = req.body;

    if (!taskName || !projectId) {
      return res.status(400).json({ message: 'Task name and Project ID are required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (assignedTo) {
      const assignee = await User.findById(assignedTo);
      if (!assignee) {
        return res.status(404).json({ message: 'Assigned user not found' });
      }
    }

    const task = await Task.create(req.body);
    const populatedTask = await Task.findById(task._id)
      .populate('projectId', 'title')
      .populate('assignedTo', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    // If status is being changed to in-progress or completed, check if user is admin or assigned user
    if (req.body.status && (req.body.status === 'in-progress' || req.body.status === 'completed')) {
      const isAdmin = req.user.role === 'Admin';
      const isAssignedUser = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
      
      if (!isAdmin && !isAssignedUser) {
        return res.status(403).json({ message: 'Only admin or assigned user can change task status' });
      }
    }
    
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('projectId', 'title')
      .populate('assignedTo', 'name email');
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask
};