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
      // Extraemos las categorías del array enviado por el frontend
      const { categorias, ...restoDatos } = datosPerfil;

      // Buscamos los IDs de las categorías en la base de datos usando sus códigos
      const categoriasDb = await tx.categorias_produccion.findMany({
        where: {
          codigo: { in: categorias }
        }
      });

      if (categoriasDb.length !== categorias.length) {
        throw new Error('Una o más categorías seleccionadas no son válidas o no existen en la base de datos.');
      }

      // Creamos el Productor y sus relaciones en la tabla intermedia productor_categorias
      await tx.productor.create({
        data: {
          ...restoDatos,
          usuarioId: user.id,
          productor_categorias: {
            create: categoriasDb.map(cat => ({
              categoriaId: cat.id
              // enTemporada tomará el valor por defecto (true) definido en el schema
            }))
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

  const token = generarToken(nuevoUsuario);
  return { token, rol: nuevoUsuario.rol, id: nuevoUsuario.id };
};

export const loginUser = async ({ email, password }) => {
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) throw new Error('Credenciales inválidas');

  const isMatch = await bcrypt.compare(password, usuario.password);
  if (!isMatch) throw new Error('Credenciales inválidas');

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
      // Validamos que exista el array de categorías y no esté vacío
      if (!datos.nombreCuenta || !datos.nombreResponsable || !datos.telefono || !datos.tipoEstablecimiento || !Array.isArray(datos.categorias) || datos.categorias.length === 0) {
        throw new Error('Faltan campos obligatorios para Productor (debe seleccionar al menos una categoría)');
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