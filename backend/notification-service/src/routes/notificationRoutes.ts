import express from 'express';
import { auth } from '../middleware/auth';
import {
  getUserNotifications,
  markAsRead,
  deleteNotification,
} from '../controllers/notificationController';

const router = express.Router();

// Protected routes
router.get('/', auth, getUserNotifications);
router.post('/mark-read', auth, markAsRead);
router.delete('/:notificationId', auth, deleteNotification);

export default router; 