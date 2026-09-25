import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

// Páginas Públicas
import { Home } from '../pages/public/Home';
import { AuthPage } from '../pages/public/AuthPage';
import { Verificacion } from '../pages/public/Verificacion';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

// Páginas Privadas (Roles y Perfil)
import { ConsumidorDashboard } from '../pages/consumidor/ConsumidorDashboard';
import { EmprendedorDashboard } from '../pages/emprendedor/EmprendedorDashboard';
import { ProductorDashboard } from '../pages/productor/ProductorDashboard';
import { ProfilePage } from '../pages/private/ProfilePage';

import { AdminDashboard } from '../pages/admin/AdminDashboard';

export const AppRouter = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 1. Landing Page principal */}
          <Route path="/" element={<Home />} />

          {/* 2. Página de Login y Registro */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          
          <Route path="/verificar" element={<Verificacion />} />

          {/* 3. Rutas de cada Rol */}
          <Route path="/consumidor" element={<ConsumidorDashboard />} />
          <Route path="/emprendedor" element={<EmprendedorDashboard />} />
          <Route path="/productor" element={<ProductorDashboard />} />
          
          <Route path="/admin" element={<AdminDashboard />} />
          
          <Route path="/perfil" element={<ProfilePage />} />
          
          {/* Redirección comodín */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};