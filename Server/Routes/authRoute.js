import express from 'express';
import {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  logoutUser,
  getCurrentUser,
  getAllUsers,
} from '../Controller/userController.js';
import authMiddleware from '../Middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);


// Cookie-based Logout Route
router.get('/logout', logoutUser);

// Protected Routes (need token in cookies)
router.put('/updateuser/:id', authMiddleware, updateUser);
router.get('/current-user', authMiddleware, getCurrentUser);
router.delete('/delete/:id', authMiddleware, deleteUser);
router.get('/all' , getAllUsers)

export default router;
