import { useState, useContext } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

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
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Verifica tu Email</h2>
      <p>Hemos enviado un código de 6 dígitos a <b>{email}</b></p>
      
      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          maxLength="6"
          placeholder="Ej: 123456"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '18px', letterSpacing: '2px', width: '100%', textAlign: 'center' }}
        />
        <button type="submit" style={{ marginTop: '20px', padding: '10px 20px', width: '100%', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Verificar y Entrar
        </button>
      </form>
    </div>
  );
};