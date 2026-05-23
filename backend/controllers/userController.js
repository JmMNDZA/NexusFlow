const User = require('../models/User');
const Project = require('../models/Project');
const jwt = require('jsonwebtoken');

// Helper function to generate project codes
const generateProjectCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Helper function to generate JWT tokens
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/v1/users
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, projectName, inviteCode } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        let assignedProjectCode = '';

        if (role === 'Project Manager') {
            assignedProjectCode = generateProjectCode();
            const user = await User.create({ name, email, password, role, activeProjectCode: assignedProjectCode });
            await Project.create({ 
                title: projectName || 'My First Project', 
                owner: user._id, 
                projectCode: assignedProjectCode 
            });
        } else {
            // Match the frontend field name 'inviteCode'
            const project = await Project.findOne({ projectCode: inviteCode });
            if (!project) return res.status(404).json({ message: 'Invalid invite code. Project not found.' });
            
            assignedProjectCode = inviteCode;
            await User.create({ name, email, password, role, activeProjectCode: assignedProjectCode });
        }

        res.status(201).json({ message: 'Registration successful', projectCode: assignedProjectCode });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/v1/users/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        
        if (user && (await user.matchPassword(password))) {
            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    activeProjectCode: user.activeProjectCode,
                },
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get logged in user profile
// @route   GET /api/v1/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            activeProjectCode: user.activeProjectCode,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all users across the system
// @route   GET /api/v1/users
// @access  Public (for dev/testing)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update user profile details
// @route   PUT /api/v1/users/profile
// @access  Private
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.activeProjectCode = req.body.activeProjectCode || user.activeProjectCode;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: 'User updated successfully',
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                activeProjectCode: updatedUser.activeProjectCode,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete user account by ID
// @route   DELETE /api/v1/users/:id
// @access  Private
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.deleteOne();
        res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Export ALL functions cleanly so routes/userRoutes.js doesn't crash
module.exports = { 
    registerUser, 
    authUser, 
    getUserProfile, 
    getUsers, 
    updateUser, 
    deleteUser 
};
