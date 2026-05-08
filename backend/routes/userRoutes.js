const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile } = require('../controllers/userController');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

router.post('/', validateUserRegistration, registerUser);
router.post('/login', validateUserLogin, authUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;