import { Navigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../../components/auth/LoginForm';
import { RegisterForm } from '../../components/auth/RegisterForm';
import '../../styles/stile.css'; // Asegúrate de importar tus estilos

export const AuthPage = () => {
  const { pathname } = useLocation();

  if (pathname === '/') return <Navigate to="/login" replace />;
  return pathname === '/register' ? <RegisterForm /> : <LoginForm />;
};