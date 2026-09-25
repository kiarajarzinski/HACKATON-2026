import { prisma } from '../config/prisma.js';

export const crearPublicacion = async (usuarioId, rol, datos) => {
  let productorId = null;
  let emprendimientoId = null;

  if (rol === 'PRODUCTOR') {
    const productor = await prisma.productor.findUnique({ where: { usuarioId } });
    if (!productor) throw new Error('Perfil de productor no encontrado');
    productorId = productor.id;
  } else if (rol === 'EMPRENDIMIENTO') {
    const emprendimiento = await prisma.emprendimiento.findUnique({ where: { usuarioId } });
    if (!emprendimiento) throw new Error('Perfil de emprendimiento no encontrado');
    emprendimientoId = emprendimiento.id;
  } else {
    throw new Error('Los consumidores no pueden crear publicaciones');
  }

  const nuevaPublicacion = await prisma.publicaciones.create({
    data: {
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      precio: parseFloat(datos.precio),
      unidadMedida: datos.unidadMedida,
      stock: parseFloat(datos.stock || 0),
      pedidoMinimo: parseFloat(datos.pedidoMinimo || 1),
      productorId,
      emprendimientoId,
      esAlertaRadar: datos.esAlertaRadar || false,
      activo: true
    }
  });

  return nuevaPublicacion;
};

export const actualizarPublicacion = async (id, datos) => {
  const publicacionActualizada = await prisma.publicaciones.update({
    where: { id },
    data: {
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      precio: parseFloat(datos.precio),
      unidadMedida: datos.unidadMedida,
      stock: parseFloat(datos.stock),
      pedidoMinimo: parseFloat(datos.pedidoMinimo)
    }
  });
  return publicacionActualizada;
};

export const eliminarPublicacion = async (id) => {
  await prisma.publicaciones.delete({
    where: { id }
  });
  return { mensaje: 'Publicación eliminada correctamente' };
};