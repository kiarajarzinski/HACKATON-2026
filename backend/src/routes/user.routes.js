import { Router } from 'express';
import { getProfile, actualizarFotoPerfil, getMapLocations } from '../controllers/user.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/profile', verificarToken, getProfile);
router.put('/profile-picture', verificarToken, upload.single('foto'), actualizarFotoPerfil);
router.get('/map-locations', verificarToken, getMapLocations);


export default router;