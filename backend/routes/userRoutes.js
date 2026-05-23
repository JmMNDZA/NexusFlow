const express = require('express');
const router = express.Router();
// Added updateUser and deleteUser to the imports
const { 
  registerUser, 
  authUser, 
  getUserProfile, 
  getUsers, 
  updateUser, 
  deleteUser 
} = require('../controllers/userController');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');
const { protect, authorize } = require('../middleware/auth');

// --- PUBLIC ROUTES ---
router.post('/', validateUserRegistration, registerUser); // CREATE (Register)
router.post('/login', validateUserLogin, authUser);       // READ (Login/Auth)

// --- PRIVATE / PROTECTED ROUTES ---
router.get('/', protect, authorize('Admin'), getUsers);                         // READ (Get All Users)
router.get('/profile', protect, getUserProfile);                                // READ (Get Current Profile)
router.put('/profile', protect, updateUser);                                    // UPDATE (Update Current User)
router.delete('/:id', protect, authorize('Admin'), deleteUser);                // DELETE (Remove User by ID)

module.exports = router;