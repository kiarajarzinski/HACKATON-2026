import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/Login.css'; 

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
    <div className="login-page-wrapper">
      <div className="login-card">
        
        {view === 'login' && (
          <>
            <div className="login-header">
              <span className="login-badge">PORTAL DE ACCESO</span>
              <h2>Bienvenido de vuelta</h2>
              <p>Ingresa tus credenciales para acceder a la red.</p>
            </div>

            {error && <div className="login-alert error">{error}</div>}
            {success && <div className="login-alert success">{success}</div>}
            
            <form className="login-form" onSubmit={handleLoginSubmit}>
              <div className="login-input-group">
                <label>Correo Electrónico</label>
                <input className="login-input" type="email" name="email" value={formData.email} required onChange={handleChange} placeholder="correo@ejemplo.com" />
              </div>
              <div className="login-input-group">
                <div className="login-label-flex">
                  <label>Contraseña</label>
                  <a href="#!" onClick={(e) => { e.preventDefault(); setView('forgot'); setError(null); setSuccess(null); }}>
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <input className="login-input" type="password" name="password" value={formData.password} required onChange={handleChange} placeholder="••••••••" />
              </div>
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar a mi Cuenta'}
              </button>
              
              <p className="login-footer">
                ¿Aún no tienes cuenta? <Link to="/register">Regístrate gratis</Link>
              </p>
            </form>
          </>
        )}

        {view === 'forgot' && (
          <>
            <div className="login-header">
              <span className="login-badge">RECUPERACIÓN</span>
              <h2>Recuperar Contraseña</h2>
              <p>Ingresa tu email y te enviaremos un código de 6 dígitos.</p>
            </div>
            
            {error && <div className="login-alert error">{error}</div>}
            {success && <div className="login-alert success">{success}</div>}
            
            <form className="login-form" onSubmit={handleForgotSubmit}>
              <div className="login-input-group">
                <label>Email</label>
                <input className="login-input" type="email" name="email" value={formData.email} required onChange={handleChange} />
              </div>
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Código'}
              </button>
              <button className="login-secondary-btn" type="button" onClick={() => setView('login')}>Volver</button>
            </form>
          </>
        )}

        {view === 'reset' && (
          <>
            <div className="login-header">
              <span className="login-badge">RESTABLECER</span>
              <h2>Restablecer Contraseña</h2>
              <p>Ingresa el código que enviamos a <b>{formData.email}</b></p>
            </div>
            
            {error && <div className="login-alert error">{error}</div>}
            {success && <div className="login-alert success">{success}</div>}
            
            <form className="login-form" onSubmit={handleResetSubmit}>
              <div className="login-input-group">
                <label>Código de 6 dígitos</label>
                <input className="login-input" type="text" name="codigo" value={formData.codigo} maxLength="6" required onChange={handleChange} style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }} />
              </div>
              <div className="login-input-group">
                <label>Nueva Contraseña</label>
                <input className="login-input" type="password" name="newPassword" value={formData.newPassword} required onChange={handleChange} />
              </div>
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Cambiar Contraseña'}
              </button>
              <button className="login-secondary-btn" type="button" onClick={() => setView('login')}>Cancelar</button>
            </form>
          </>
        )}
        
      </div>
    </div>
  );
};