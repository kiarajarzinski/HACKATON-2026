import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { enviarCorreoVerificacion } from '../utils/mailer.js';

export const registerUser = async ({ email, password, rol, datosPerfil }) => {
  const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
  if (usuarioExistente) throw new Error('El email ya está registrado');

  validarDatosPerfil(rol, datosPerfil);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();
  const tokenVerificacion = `${codigo}-${Date.now()}`;

  const nuevoUsuario = await prisma.$transaction(async (tx) => {
    const user = await tx.usuario.create({
      data: { email, password: hashedPassword, rol, tokenVerificacion, emailVerificado: false }
    });
    
    if (rol === 'PRODUCTOR') {
      const { categorias, ...restoDatos } = datosPerfil;

      const categoriasDb = await tx.categorias_produccion.findMany({
        where: { codigo: { in: categorias } }
      });

      if (categoriasDb.length !== categorias.length) {
        throw new Error('Categorías seleccionadas no válidas');
      }

      await tx.productor.create({
        data: {
          ...restoDatos,
          usuarioId: user.id,
          productor_categorias: {
            create: categoriasDb.map(cat => ({ categoriaId: cat.id }))
          }
        }
      });
    } else if (rol === 'EMPRENDIMIENTO') {
      await tx.emprendimiento.create({
        data: { ...datosPerfil, usuarioId: user.id }
      });
    } else if (rol === 'CONSUMIDOR') {
      await tx.consumidor.create({
        data: { ...datosPerfil, usuarioId: user.id }
      });
    }

    return user;
  });

  enviarCorreoVerificacion(email, codigo);
  return { email: nuevoUsuario.email };
};

export const loginUser = async ({ email, password }) => {
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) throw new Error('Credenciales inválidas');

  if (!usuario.emailVerificado) throw new Error('Email no verificado');

  const isMatch = await bcrypt.compare(password, usuario.password);
  if (!isMatch) throw new Error('Credenciales inválidas');

  const token = generarToken(usuario);
  return { token, rol: usuario.rol, id: usuario.id };
};

export const verifyEmailUser = async (email, codigoIngresado) => {
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) throw new Error('Usuario no encontrado');
  if (usuario.emailVerificado) throw new Error('El email ya está verificado');
  if (!usuario.tokenVerificacion) throw new Error('No hay código pendiente');

  const codigoReal = usuario.tokenVerificacion.split('-')[0];

  if (codigoReal !== codigoIngresado) {
    throw new Error('Código de verificación incorrecto');
  }

  await prisma.usuario.update({
    where: { email },
    data: { emailVerificado: true, tokenVerificacion: null }
  });

  const token = generarToken(usuario);
  return { token, rol: usuario.rol, id: usuario.id };
};

const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

const validarDatosPerfil = (rol, datos) => {
  if (!datos) throw new Error('Los datos del perfil son obligatorios');

  switch (rol) {
    case 'PRODUCTOR':
      if (!datos.nombreCuenta || !datos.nombreResponsable || !datos.telefono || !datos.tipoEstablecimiento || !Array.isArray(datos.categorias) || datos.categorias.length === 0) {
        throw new Error('Faltan campos obligatorios para Productor');
      }
      break;
    case 'EMPRENDIMIENTO':
      if (!datos.nombreCuenta || !datos.nombreResponsable || !datos.telefono || !datos.rubro) {
        throw new Error('Faltan campos obligatorios para Emprendimiento');
      }
      break;
    case 'CONSUMIDOR':
      if (!datos.nombre || !datos.apellido) {
        throw new Error('Faltan campos obligatorios para Consumidor');
      }
      break;
    default:
      throw new Error('Rol no válido');
  }
};

export const updateUserLocation = async (usuarioId, rol, datosUbicacion) => {
  const { latitud, longitud, localidad, direccionReferencia } = datosUbicacion;

  if (rol === 'CONSUMIDOR') {
    await prisma.consumidor.update({
      where: { usuarioId },
      data: { latitud, longitud, localidad }
    });
  } else if (rol === 'EMPRENDIMIENTO') {
    await prisma.emprendimiento.update({
      where: { usuarioId },
      data: { latitud, longitud, localidad, direccionReferencia }
    });
  } else if (rol === 'PRODUCTOR') {
    await prisma.productor.update({
      where: { usuarioId },
      data: { latitud, longitud, localidad, direccionReferencia }
    });
  }
  return { mensaje: 'Ubicación guardada correctamente' };
};