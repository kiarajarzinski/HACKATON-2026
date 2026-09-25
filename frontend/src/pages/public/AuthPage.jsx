import { useState } from 'react';
import { LoginForm } from '../../components/auth/LoginForm';
import { RegisterForm } from '../../components/auth/RegisterForm';
import '../../styles/stile.css'; 

export const AuthPage = () => {
  const [activeView, setActiveView] = useState('login'); 

  return (
    <div className="auth-page-container" style={{ padding: '0', maxWidth: '100%', margin: '0 auto' }}>
      <div className="form-container">
        {activeView === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};