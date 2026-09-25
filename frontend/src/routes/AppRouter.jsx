import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

import { AuthPage } from '../pages/public/AuthPage';
import { Verificacion } from '../pages/public/Verificacion';

import { ConsumidorDashboard } from '../pages/consumidor/ConsumidorDashboard';
import { EmprendedorDashboard } from '../pages/emprendedor/EmprendedorDashboard';
import { ProductorDashboard } from '../pages/productor/ProductorDashboard';

export const AppRouter = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/verificar" element={<Verificacion />} />

          <Route path="/consumidor" element={<ConsumidorDashboard />} />
          <Route path="/emprendedor" element={<EmprendedorDashboard />} />
          <Route path="/productor" element={<ProductorDashboard />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};