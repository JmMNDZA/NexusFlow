const express = require('express');
const router = express.Router();
const { registerUser, authUser } = require('../controllers/userController');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');

router.post('/', validateUserRegistration, registerUser);
router.post('/login', validateUserLogin, authUser);

module.exports = router;