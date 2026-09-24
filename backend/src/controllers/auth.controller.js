import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

export const register = async (req, res) => {
  try {
    const { email, password, rol, datosPerfil } = req.body;

    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

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
      } else {
        throw new Error("Rol no válido");
      }

      return user;
    });


    const token = jwt.sign(
      { id: nuevoUsuario.id, rol: nuevoUsuario.rol }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, rol: nuevoUsuario.rol, mensaje: 'Registro exitoso' });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error en el servidor al registrar el usuario' });
  }
};