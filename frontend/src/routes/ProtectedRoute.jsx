//Componente que patea al usuario al Login si no tiene permis
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  // Evita parpadeos o redirecciones falsas mientras lee el localStorage
  if (loading) return <div className="loading-screen">Cargando...</div>; 

  // Si no hay usuario logueado, lo mandamos al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Verifica si el rol del usuario está dentro del array de roles permitidos
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    // Si un consumidor intenta entrar a /productor, lo devolvemos a su panel
    return <Navigate to={`/${user.rol.toLowerCase()}`} replace />;
  }

  return <Outlet />;
};