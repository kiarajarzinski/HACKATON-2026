import React, { useState, useEffect } from 'react';

export const AdminLayout = ({ children }) => {
  const [activeSection, setActiveSection] = useState('panel-general');

  const navItems = [
    { label: 'Panel General', id: 'panel-general', icon: 'space_dashboard' },
    { label: 'Moderación', id: 'moderacion-reportes', icon: 'gavel' },
    { label: 'Usuarios', id: 'gestion-usuarios', icon: 'manage_accounts' },
    { label: 'Métricas', id: 'metricas-globales', icon: 'insights' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      let actual = '';
      const mitadPantalla = window.innerHeight / 2;
      
      navItems.forEach((item) => {
        const section = document.getElementById(item.id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= mitadPantalla && rect.bottom >= mitadPantalla) {
            actual = item.id;
          }
        }
      });

      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        actual = 'metricas-globales';
      }
      
      if (actual) setActiveSection(actual);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="admin-wrapper">
      
      {/* SIDEBAR LATERAL (LIMPIO) */}
      <aside className="admin-sidebar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50px', backgroundColor: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'white' }}>eco</span>
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--kombu-green)', margin: 0, lineHeight: '1.2' }}>EcoNexo</h2>
              <span style={{ fontSize: '0.7rem', color: 'var(--dark-moss)', textTransform: 'uppercase', fontWeight: '700' }}>Formosa Admin</span>
            </div>
          </div>

          <nav className="admin-nav">
            <span style={{ padding: '0 16px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--dark-moss)', opacity: 0.7, marginBottom: '8px', textAlign: 'center' }}>
              Navegación
            </span>
            {navItems.map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`}
                className={`admin-nav-item ${activeSection === item.id ? 'activo' : ''}`}
              >
                <span className="material-symbols-outlined">{item.icon}</span> 
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* HEADER SUPERIOR */}
      <header className="admin-header">
        <span className="admin-badge badge-green">
          <span style={{ width: '6px', height: '6px', borderRadius: '50px', backgroundColor: 'var(--kombu-green)', display: 'inline-block' }}></span>
          Nodo Formosa Operativo
        </span>

        {/* PERFIL CON LOGOUT OCULTO */}
        <div className="header-profile-wrap">
          <div style={{ textAlign: 'right' }}>
            <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--kombu-green)' }}>admin@econexo.ar</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--dark-moss)' }}>Administrador General</span>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50px', backgroundColor: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ color: 'white' }}>person</span>
          </div>
          
          {/* Botón flotante animado al pasar el mouse por este bloque */}
          <button className="header-logout-tooltip">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span> Cerrar Sesión
          </button>
        </div>

      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="admin-main">
        {children}
      </main>
      
    </div>
  );
};