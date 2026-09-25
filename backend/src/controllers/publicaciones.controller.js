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

export const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const publicacion = await publicacionesService.actualizarPublicacion(id, req.body);
    res.status(200).json(publicacion);
  } catch (error) {
    console.error('Error al actualizar publicación:', error.message);
    res.status(400).json({ error: 'Error al actualizar el producto' });
  }
};

export const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await publicacionesService.eliminarPublicacion(id);
    res.status(200).json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    console.error('Error al eliminar publicación:', error.message);
    res.status(400).json({ error: 'Error al eliminar el producto' });
  }
};