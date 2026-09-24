import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Nuevo estado de éxito

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      const res = await login(formData.email, formData.password);
      
      // Mostramos el mensaje
      setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
      
      // Retrasamos la redirección 1.5 segundos
      setTimeout(() => {
        if (res.rol === 'CONSUMIDOR') navigate('/consumidor');
        if (res.rol === 'EMPRENDIMIENTO') navigate('/emprendedor');
        if (res.rol === 'PRODUCTOR') navigate('/productor');
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      
      {/* Alertas visuales */}
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {success && <div style={{ color: 'green', fontWeight: 'bold', marginBottom: '10px' }}>{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" required onChange={handleChange} />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" name="password" required onChange={handleChange} />
        </div>
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};