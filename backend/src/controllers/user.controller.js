import { prisma } from '../config/prisma.js';
import { supabase } from '../config/supabase.js';

const subirImagenSupabase = async (file) => {
  if (!file) return null;
  
  const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  
  const { data, error } = await supabase.storage
    .from('perfiles')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) {
    console.error('Detalle del error de Supabase:', error);
    throw new Error('Error al subir la imagen a Supabase');
  }

  const { data: publicData } = supabase.storage
    .from('perfiles')
    .getPublicUrl(fileName);

  return publicData.publicUrl;
};

export const getProfile = async (req, res) => {
  try {
    const { id } = req.usuario;

const user = await prisma.usuario.findUnique({
      where: { id },
      include: {
        consumidor: true,
        emprendimiento: {
          include: { publicaciones: true } 
        },
        productor: {
          include: {
            productor_categorias: {
              include: { categorias_produccion: true }
            },
            publicaciones: true 
          }
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ error: 'Error interno al cargar el perfil' });
  }
};

export const actualizarFotoPerfil = async (req, res) => {
  try {
    const { id, rol } = req.usuario;

    if (rol === 'CONSUMIDOR') {
      return res.status(403).json({ error: 'Los consumidores utilizan avatar genérico' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No se adjuntó ninguna imagen' });
    }

    // Subir a Supabase
    const fotoUrl = await subirImagenSupabase(req.file);

    // Actualizar en Prisma según el rol
    if (rol === 'PRODUCTOR') {
      await prisma.productor.update({
        where: { usuarioId: id },
        data: { fotoPerfil: fotoUrl }
      });
    } else if (rol === 'EMPRENDIMIENTO') {
      await prisma.emprendimiento.update({
        where: { usuarioId: id },
        data: { fotoPerfil: fotoUrl }
      });
    }

    res.status(200).json({ mensaje: 'Foto actualizada correctamente', fotoUrl });
  } catch (error) {
    console.error('Error al actualizar foto de perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar la foto' });
  }
};

export const getMapLocations = async (req, res) => {
  try {
    const { id, rol } = req.usuario;
    let locations = [];

    if (rol === 'CONSUMIDOR') {
      // Los consumidores ven a los Emprendimientos
      const emprendimientos = await prisma.emprendimiento.findMany({
        where: { latitud: { not: null }, longitud: { not: null } },
        select: { id: true, nombreCuenta: true, latitud: true, longitud: true, rubro: true }
      });
      locations = emprendimientos.map(e => ({ ...e, tipo: 'EMPRENDIMIENTO' }));
      
    } else if (rol === 'EMPRENDIMIENTO' || rol === 'PRODUCTOR') {
      // Emprendimientos y Productores ven a los Productores
      const productores = await prisma.productor.findMany({
        where: {
          latitud: { not: null },
          longitud: { not: null },
          usuarioId: { not: id } // Excluir al usuario actual de su propio mapa
        },
        select: { id: true, nombreCuenta: true, latitud: true, longitud: true, tipoEstablecimiento: true }
      });
      locations = productores.map(p => ({ ...p, tipo: 'PRODUCTOR' }));
    }

    res.status(200).json(locations);
  } catch (error) {
    console.error('Error al obtener ubicaciones del mapa:', error);
    res.status(500).json({ error: 'Error al cargar los datos del mapa' });
  }
};