import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  register,
  login,
  getProfile,
  updatePoints,
} from '../controllers/userController';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.patch('/points', auth, updatePoints);

export default router; 