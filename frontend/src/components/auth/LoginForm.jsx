import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); 
  const [loading, setLoading] = useState(false); // Añadimos loading para deshabilitar el botón

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      const res = await login(formData.email, formData.password);
      
      // Mostramos el mensaje de éxito
      setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
      
      // Retrasamos la redirección 1.5 segundos (Tu lógica original)
      const destinations = { CONSUMIDOR: '/consumidor', EMPRENDIMIENTO: '/emprendedor', PRODUCTOR: '/productor' };
      setTimeout(() => navigate(destinations[res.rol] || '/'), 500);

    } catch (err) {
      // Capturamos el error de tu backend
      setError(err.message || err.response?.data?.error || 'Error al iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-centered">
      <div className="auth-card">
        {/* Encabezado del Formulario */}
        <div className="auth-header text-center">
          <span className="badge-portal">Portal de Acceso</span>
          <h2>Bienvenido de vuelta</h2>
          <p>Ingresa tus credenciales para acceder a la red.</p>
        </div>

        {/* Alertas Visuales */}
        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              name="email" 
              required 
              onChange={handleChange} 
              placeholder="correo@ejemplo.com" 
            />
          </div>

          <div className="input-group">
            <div className="label-flex">
              <label>Contraseña</label>
              <Link to="/recovery" className="btn-link">¿Olvidaste tu contraseña?</Link>
            </div>
            <input 
              type="password" 
              name="password" 
              required 
              onChange={handleChange} 
              placeholder="••••••••" 
            />
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Verificando...' : 'Ingresar a mi Cuenta'}
          </button>
        </form>

        <p className="form-footer text-center">
          ¿Aún no tienes cuenta? <Link to="/register">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  );
};