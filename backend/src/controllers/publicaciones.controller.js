import * as publicacionesService from '../services/publicaciones.service.js';

export const crear = async (req, res) => {
  try {
    const { id, rol } = req.usuario; 
    const publicacion = await publicacionesService.crearPublicacion(id, rol, req.body);
    
    res.status(201).json(publicacion);
  } catch (error) {
    console.error('Error al crear publicación:', error.message);
    res.status(400).json({ error: error.message });
  }
};