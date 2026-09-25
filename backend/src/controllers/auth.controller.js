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

export const updateLocation = async (req, res) => {
  try {
    const { latitud, longitud, localidad, direccionReferencia } = req.body;
    const { id, rol } = req.usuario; // Extraído del token por el middleware

    const result = await authService.updateUserLocation(id, rol, { 
      latitud, longitud, localidad, direccionReferencia 
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error guardando ubicación:', error.message);
    res.status(500).json({ error: 'Error al actualizar la ubicación' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const result = await authService.solicitarRecuperacionPassword(req.body.email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, codigo, nuevaPassword } = req.body;
    const result = await authService.restablecerPassword(email, codigo, nuevaPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};