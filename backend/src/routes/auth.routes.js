import { Router } from 'express';
import { register, login, verify, updateLocation, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify', verify);
router.post('/location', verificarToken, updateLocation); 

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;