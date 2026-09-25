import { prisma } from '../config/prisma.js';

export const getProfile = async (req, res) => {
  try {
    const { id } = req.usuario;

    const user = await prisma.usuario.findUnique({
      where: { id },
      include: {
        consumidor: true,
        emprendimiento: true,
        productor: {
          include: {
            productor_categorias: {
              include: {
                categorias_produccion: true
              }
            }
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