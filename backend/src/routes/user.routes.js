import { Router } from 'express';
import { getProfile, actualizarFotoPerfil } from '../controllers/user.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/profile', verificarToken, getProfile);
router.put('/profile-picture', verificarToken, upload.single('foto'), actualizarFotoPerfil);

export default router;