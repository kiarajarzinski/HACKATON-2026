import { useState, useContext } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/verification.css';

export const Verificacion = () => {
  const { verifyCode } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email;
  
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState(null);

  if (!email) return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await verifyCode(email, codigo);
      if (res.rol === 'CONSUMIDOR') navigate('/consumidor');
      if (res.rol === 'EMPRENDIMIENTO') navigate('/emprendedor');
      if (res.rol === 'PRODUCTOR') navigate('/productor');
    } catch (err) {
      setError(err.response?.data?.error || 'Código incorrecto');
    }
  };

  return (
    <div className="verification-page">
      <div className="verification-card">
        <h2>Verifica tu Email</h2>
        <p>
          Hemos enviado un código de 6 dígitos a <span>{email}</span>
        </p>

        {error && <div className="verification-error">{error}</div>}

        <form onSubmit={handleSubmit} className="verification-form">
          <input
            type="text"
            maxLength="6"
            placeholder="Ej: 123456"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />

          <button type="submit">
            Verificar y Entrar
          </button>
        </form>
      </div>
    </div>
  );
};