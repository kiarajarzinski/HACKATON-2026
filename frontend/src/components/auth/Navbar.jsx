import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      padding: '1rem 2rem', backgroundColor: '#2c3e50', color: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* Usamos Link para volver al dashboard correspondiente al hacer clic en el título */}
      <Link to={`/${user?.rol?.toLowerCase() || ''}`} style={{ color: 'white', textDecoration: 'none' }}>
        <h2 style={{ margin: 0 }}>Mi Hackathon</h2>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span style={{ fontSize: '14px', opacity: 0.9 }}>
          Sesión: <strong>{user?.rol}</strong>
        </span>
        
        {/* Botón de Perfil */}
        <button 
          onClick={() => navigate('/perfil')}
          style={btnStyle}
        >
          👤 Mi Perfil
        </button>

        <button onClick={handleLogout} style={{...btnStyle, backgroundColor: '#e74c3c'}}>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

const btnStyle = {
  padding: '8px 16px', backgroundColor: '#34495e', color: 'white', 
  border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
};