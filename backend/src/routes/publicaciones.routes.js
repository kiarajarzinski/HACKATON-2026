import { Router } from 'express';
import { crear } from '../controllers/publicaciones.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', verificarToken, crear);

export default router;