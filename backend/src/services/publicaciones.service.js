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
      esAlertaRadar: datos.esAlertaRadar === 'true' || false,
      activo: true,
      fotos: datos.fotoUrl ? [datos.fotoUrl] : [] 
    }
  });

  return nuevaPublicacion;
};

export const actualizarPublicacion = async (id, datos) => {
  const dataUpdate = {
    titulo: datos.titulo,
    descripcion: datos.descripcion,
    precio: parseFloat(datos.precio),
    unidadMedida: datos.unidadMedida,
    stock: parseFloat(datos.stock),
    pedidoMinimo: parseFloat(datos.pedidoMinimo)
  };

  if (datos.fotoUrl) {
    dataUpdate.fotos = [datos.fotoUrl];
  }

  const publicacionActualizada = await prisma.publicaciones.update({
    where: { id },
    data: dataUpdate
  });
  
  return publicacionActualizada;
};

export const eliminarPublicacion = async (id) => {
  await prisma.publicaciones.delete({
    where: { id }
  });
  
  return { mensaje: 'Publicación eliminada correctamente' };
};

export const obtenerFeed = async (usuarioId, rol) => {
  let whereClause = { activo: true };

  if (rol === 'PRODUCTOR') {
    const productor = await prisma.productor.findUnique({ where: { usuarioId } });
    if (productor) {
      whereClause.productorId = { not: productor.id }; 
    } else {
      whereClause.productorId = { not: null };
    }
    
  } else if (rol === 'EMPRENDIMIENTO') {
    whereClause.productorId = { not: null }; 
    
  } else if (rol === 'CONSUMIDOR') {
    whereClause.emprendimientoId = { not: null };
  }

  const publicaciones = await prisma.publicaciones.findMany({
    where: whereClause,
    include: {
      productores: { select: { nombreCuenta: true, localidad: true } },
      emprendimientos: { select: { nombreCuenta: true, localidad: true } },
      categorias_produccion: { select: { nombre: true } }
    },
    orderBy: { createdAt: 'desc' } 
  });

  return publicaciones;
};