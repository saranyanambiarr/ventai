import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  createPost,
  getPosts,
  getPostsByUser,
  deletePost,
} from '../controllers/postController';

const router = Router();

// Protected routes
router.post('/', auth, createPost);
router.delete('/:id', auth, deletePost);

// Public routes
router.get('/', getPosts);
router.get('/user/:userId', getPostsByUser);

export default router; 