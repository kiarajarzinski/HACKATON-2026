import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { AuthPage } from '../pages/public/AuthPage';

// Importamos los componentes de cada rol según tu estructura
import { ConsumidorDashboard } from '../pages/consumidor/ConsumidorDashboard';
import { EmprendedorDashboard } from '../pages/emprendedor/EmprendedorDashboard';
import { ProductorDashboard } from '../pages/productor/ProductorDashboard';

export const AppRouter = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública de Autenticación */}
          <Route path="/" element={<AuthPage />} />

          {/* Rutas específicas por Rol */}
          <Route path="/consumidor" element={<ConsumidorDashboard />} />
          <Route path="/emprendedor" element={<EmprendedorDashboard />} />
          <Route path="/productor" element={<ProductorDashboard />} />
          
          {/* Redirección comodín: Si ingresan una URL que no existe, vuelven al inicio */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};