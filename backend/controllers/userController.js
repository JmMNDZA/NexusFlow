const User = require('../models/User');
const Project = require('../models/Project');
const jwt = require('jsonwebtoken');

const generateProjectCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

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

module.exports = { registerUser, authUser };