import { Router } from 'express';
import { getProfile } from '../controllers/user.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/profile', verificarToken, getProfile);

export default router;