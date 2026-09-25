import * as authService from '../services/auth.service.js';

export const register = async (req, res) => {
  try {
    const { email, password, rol, datosPerfil } = req.body;
    const result = await authService.registerUser({ email, password, rol, datosPerfil });
    
    res.status(201).json({ mensaje: 'Registro exitoso, requiere verificación', ...result });
  } catch (error) {
    console.error('Error en register:', error.message);
    const statusCode = error.message.includes('obligatorios') || error.message.includes('registrado') || error.message.includes('Rol') ? 400 : 500;
    res.status(statusCode).json({ error: error.message || 'Error interno del servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });

    const result = await authService.loginUser({ email, password });
    
    res.status(200).json({ mensaje: 'Inicio de sesión exitoso', ...result });
  } catch (error) {
    console.error('Error en login:', error.message);
    const statusCode = (error.message === 'Credenciales inválidas' || error.message === 'Email no verificado') ? 401 : 500;
    res.status(statusCode).json({ error: error.message || 'Error interno' });
  }
};

export const verify = async (req, res) => {
  try {
    const { email, codigo } = req.body;
    const result = await authService.verifyEmailUser(email, codigo);
    
    res.status(200).json({ mensaje: 'Email verificado exitosamente', ...result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};