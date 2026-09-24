import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

export const registerUser = async ({ email, password, rol, datosPerfil }) => {
  const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
  if (usuarioExistente) {
    throw new Error('El email ya está registrado');
  }

  validarDatosPerfil(rol, datosPerfil);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const nuevoUsuario = await prisma.$transaction(async (tx) => {
    const user = await tx.usuario.create({
      data: { email, password: hashedPassword, rol }
    });
    
    if (rol === 'PRODUCTOR') {
      await tx.productor.create({
        data: { ...datosPerfil, usuarioId: user.id }
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

  // 5. Generar y retornar JWT
  const token = generarToken(nuevoUsuario);
  return { token, rol: nuevoUsuario.rol, id: nuevoUsuario.id };
};

export const loginUser = async ({ email, password }) => {
  // 1. Buscar usuario
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    throw new Error('Credenciales inválidas');
  }

  // 2. Verificar contraseña
  const isMatch = await bcrypt.compare(password, usuario.password);
  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }

  // 3. Generar y retornar JWT
  const token = generarToken(usuario);
  return { token, rol: usuario.rol, id: usuario.id };
};

// --- Funciones Auxiliares Privadas ---

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
      if (!datos.nombreCuenta || !datos.nombreResponsable || !datos.telefono || !datos.tipoEstablecimiento) {
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