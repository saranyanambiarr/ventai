import { Router } from 'express';
import { register, login, checkUsernameAvailability } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/check-username/:username', checkUsernameAvailability);

export default router; 