import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';

// Páginas Públicas
import { AuthPage } from '../pages/public/AuthPage';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

// Dashboards (Tus componentes privados)
import { ConsumidorDashboard } from '../pages/consumidor/ConsumidorDashboard';
import { EmprendedorDashboard } from '../pages/emprendedor/EmprendedorDashboard';
import { ProductorDashboard } from '../pages/productor/ProductorDashboard';

export const AppRouter = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ================= RUTAS PÚBLICAS ================= */}
          <Route path="/" element={<AuthPage />} />
          
          {/* Agregamos las rutas de los formularios que creamos */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/register/:rol" element={<RegisterForm />} />

          {/* ================= RUTAS PRIVADAS ================= */}
          {/* Protegemos el panel de Consumidor */}
          <Route element={<ProtectedRoute allowedRoles={['CONSUMIDOR']} />}>
            <Route path="/consumidor" element={<ConsumidorDashboard />} />
          </Route>

          {/* Protegemos el panel de Emprendedor */}
          <Route element={<ProtectedRoute allowedRoles={['EMPRENDIMIENTO']} />}>
            <Route path="/emprendedor" element={<EmprendedorDashboard />} />
          </Route>

          {/* Protegemos el panel de Productor */}
          <Route element={<ProtectedRoute allowedRoles={['PRODUCTOR']} />}>
            <Route path="/productor" element={<ProductorDashboard />} />
          </Route>
          
          {/* Redirección comodín: Si ingresan una URL que no existe, vuelven al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};