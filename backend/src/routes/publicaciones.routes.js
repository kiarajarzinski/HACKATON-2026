import { Router } from 'express';
import { crear, actualizar, eliminar } from '../controllers/publicaciones.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', verificarToken, crear);
router.put('/:id', verificarToken, actualizar); 
router.delete('/:id', verificarToken, eliminar); 

export default router;