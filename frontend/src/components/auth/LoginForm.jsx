import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const LoginForm = () => {
  const { login, forgotPassword, resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [view, setView] = useState('login'); 
  const [formData, setFormData] = useState({ email: '', password: '', codigo: '', newPassword: '' });
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null); setLoading(true);
    try {
      const res = await login(formData.email, formData.password);
      setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
      setTimeout(() => {
        if (res.rol === 'CONSUMIDOR') navigate('/consumidor');
        if (res.rol === 'EMPRENDIMIENTO') navigate('/emprendedor');
        if (res.rol === 'PRODUCTOR') navigate('/productor');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null); setLoading(true);
    try {
      await forgotPassword(formData.email);
      setSuccess('Código enviado. Revisa tu correo.');
      setTimeout(() => {
        setSuccess(null);
        setView('reset'); 
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al solicitar recuperación');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null); setLoading(true);
    try {
      await resetPassword(formData.email, formData.codigo, formData.newPassword);
      setSuccess('¡Contraseña actualizada exitosamente!');
      setTimeout(() => {
        setSuccess(null);
        setFormData({ ...formData, password: '', codigo: '', newPassword: '' });
        setView('login'); 
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al restablecer contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      
      {view === 'login' && (
        <>
          <h2>Iniciar Sesión</h2>
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          {success && <div style={{ color: 'green', fontWeight: 'bold', marginBottom: '10px' }}>{success}</div>}
          
          <form onSubmit={handleLoginSubmit}>
            <div>
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} required onChange={handleChange} />
            </div>
            <div>
              <label>Contraseña:</label>
              <input type="password" name="password" value={formData.password} required onChange={handleChange} />
            </div>
            <button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
            
            <p style={{ textAlign: 'center', marginTop: '15px' }}>
              <a href="#!" onClick={(e) => { e.preventDefault(); setView('forgot'); setError(null); setSuccess(null); }} style={{ color: '#3498db', textDecoration: 'none' }}>
                ¿Olvidaste tu contraseña?
              </a>
            </p>
          </form>
        </>
      )}

      {view === 'forgot' && (
        <>
          <h2>Recuperar Contraseña</h2>
          <p style={{ fontSize: '14px', marginBottom: '15px' }}>Ingresa tu email y te enviaremos un código de 6 dígitos.</p>
          
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          {success && <div style={{ color: 'green', fontWeight: 'bold', marginBottom: '10px' }}>{success}</div>}
          
          <form onSubmit={handleForgotSubmit}>
            <div>
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} required onChange={handleChange} />
            </div>
            <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar Código'}</button>
            <button type="button" onClick={() => setView('login')} style={{ backgroundColor: '#ccc', marginTop: '10px' }}>Volver</button>
          </form>
        </>
      )}

      {view === 'reset' && (
        <>
          <h2>Restablecer Contraseña</h2>
          <p style={{ fontSize: '14px', marginBottom: '15px' }}>Ingresa el código que enviamos a <b>{formData.email}</b></p>
          
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          {success && <div style={{ color: 'green', fontWeight: 'bold', marginBottom: '10px' }}>{success}</div>}
          
          <form onSubmit={handleResetSubmit}>
            <div>
              <label>Código de 6 dígitos:</label>
              <input type="text" name="codigo" value={formData.codigo} maxLength="6" required onChange={handleChange} style={{ letterSpacing: '2px', textAlign: 'center' }} />
            </div>
            <div>
              <label>Nueva Contraseña:</label>
              <input type="password" name="newPassword" value={formData.newPassword} required onChange={handleChange} />
            </div>
            <button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Cambiar Contraseña'}</button>
            <button type="button" onClick={() => setView('login')} style={{ backgroundColor: '#ccc', marginTop: '10px' }}>Cancelar</button>
          </form>
        </>
      )}
      
    </div>
  );
};