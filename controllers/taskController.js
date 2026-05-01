const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

// GET all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('projectId', 'title')
      .populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET tasks by project ID
const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate('projectId', 'title')
      .populate('assignedTo', 'name email');
    
    if (tasks.length === 0) {
      return res.json({ message: 'No tasks found for this project', tasks: [] });
    }
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET a single task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('projectId', 'title')
      .populate('assignedTo', 'name email');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CREATE a new task
const createTask = async (req, res) => {
  const { projectId, taskName, assignedTo, priority, dueDate, status, description } = req.body;
  
  try {
    // Verify project exists
    const projectExists = await Project.findById(projectId);
    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify assigned user exists (if provided)
    if (assignedTo) {
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        return res.status(404).json({ message: 'Assigned user not found' });
      }
    }

    const task = await Task.create({
      projectId,
      taskName,
      description,
      assignedTo: assignedTo || null,
      priority,
      status: status || 'todo',
      dueDate
    });

    const populatedTask = await task.populate([
      { path: 'projectId', select: 'title' },
      { path: 'assignedTo', select: 'name email' }
    ]);

    res.status(201).json({ message: 'Task created successfully!', task: populatedTask });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE a task
const updateTask = async (req, res) => {
  const { taskName, assignedTo, priority, dueDate, status, description, subTasks } = req.body;
  
  try {
    // Verify assigned user exists (if provided)
    if (assignedTo) {
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        return res.status(404).json({ message: 'Assigned user not found' });
      }
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { taskName, assignedTo, priority, dueDate, status, description, subTasks },
      { new: true, runValidators: true }
    ).populate([
      { path: 'projectId', select: 'title' },
      { path: 'assignedTo', select: 'name email' }
    ]);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task updated successfully!', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllTasks,
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
