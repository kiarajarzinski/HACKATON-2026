import { useState } from 'react';
import { LoginForm } from '../../components/auth/LoginForm';
import { RegisterForm } from '../../components/auth/RegisterForm';
import '../../styles/stile.css'; // Asegúrate de importar tus estilos

export const AuthPage = () => {
  // Estado para controlar qué formulario renderizar ('login' o 'register')
  const [activeView, setActiveView] = useState('login'); 

  return (
    <div className="auth-page-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Título principal basado en tu imagen */}
      <h1>Mi Hackathon</h1>

      {/* Botones de navegación de la imagen */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setActiveView('login')}
          style={{ 
            padding: '5px 15px', 
            fontWeight: activeView === 'login' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          Iniciar Sesión
        </button>
        
        <button 
          onClick={() => setActiveView('register')}
          style={{ 
            padding: '5px 15px', 
            fontWeight: activeView === 'register' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          Registrarse
        </button>
      </div>

      {/* Renderizado condicional del formulario correspondiente */}
      <div className="form-container">
        {activeView === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
      
    </div>
  );
};