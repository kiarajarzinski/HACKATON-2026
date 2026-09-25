//Tiene el Sidebar lateral y el Navbar de usuario logueado.PrivateLayout.jsx
import React from 'react';
import '../../styles/PrivateLayout.css';

export const PrivateLayout = ({ children, role }) => {
  return (
    <div className="private-layout-wrapper">
      {/* Sidebar compartido, se adaptará según el rol que le pases */}
      <aside className="private-sidebar">
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>EcoNexo</h2>
          <span style={{ fontSize: '0.75rem', color: '#AAD480' }}>Panel de {role}</span>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <a href="#" style={{ color: '#FFFAE0', textDecoration: 'none' }}>Inicio</a>
          <a href="#" style={{ color: '#FFFAE0', textDecoration: 'none' }}>Mis Productos</a>
          <a href="#" style={{ color: '#FFFAE0', textDecoration: 'none' }}>Configuración</a>
        </nav>
      </aside>

      {/* Contenido dinámico (MisAlertas, Dashboard, etc.) */}
      <main className="private-main-content">
        {children}
      </main>
    </div>
  );
};