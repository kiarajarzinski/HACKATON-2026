import * as publicacionesService from '../services/publicaciones.service.js';
import { supabase } from '../config/supabase.js';

const subirImagenSupabase = async (file) => {
  if (!file) return null;
  
  const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  
  const { data, error } = await supabase.storage
    .from('publicaciones')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) {
    console.error('Detalle del error de Supabase:', error);
    throw new Error('Error al subir la imagen a Supabase');
  }


  const { data: publicData } = supabase.storage
    .from('publicaciones')
    .getPublicUrl(fileName);

  return publicData.publicUrl;
};

export const crear = async (req, res) => {
  try {
    const { id, rol } = req.usuario;
    const fotoUrl = await subirImagenSupabase(req.file);
    const publicacion = await publicacionesService.crearPublicacion(id, rol, { ...req.body, fotoUrl });
    
    res.status(201).json(publicacion);
  } catch (error) {
    console.error('Error al crear publicación:', error.message);
    res.status(400).json({ error: error.message });
  }
};

export const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const fotoUrl = await subirImagenSupabase(req.file);
    
    const publicacion = await publicacionesService.actualizarPublicacion(id, { ...req.body, fotoUrl });
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

export const getFeed = async (req, res) => {
  try {
    const { id, rol } = req.usuario;
    const feed = await publicacionesService.obtenerFeed(id, rol);
    
    res.status(200).json(feed);
  } catch (error) {
    console.error('Error al obtener feed:', error.message);
    res.status(500).json({ error: 'Error interno al cargar los productos' });
  }
};