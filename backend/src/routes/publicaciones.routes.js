import { Router } from 'express';
import { crear, actualizar, eliminar, getFeed } from '../controllers/publicaciones.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js'; 

const router = Router();

router.get('/feed', verificarToken, getFeed);

router.post('/', verificarToken, upload.single('foto'), crear);
router.put('/:id', verificarToken, upload.single('foto'), actualizar);
router.delete('/:id', verificarToken, eliminar);

export default router;