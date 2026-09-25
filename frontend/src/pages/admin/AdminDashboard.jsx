import React from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';

export const AdminDashboard = () => {

  const globalStats = [
    { titulo: 'Comunidad Registrada', valor: '1.248', subtitulo: 'Usuarios Activos', badge: '+100% Retención', icono: 'groups', alerta: false },
    { titulo: 'Oferta Territorial', valor: '542', subtitulo: 'Publicaciones Vigentes', badge: '68 Puntos Activos', icono: 'pin_drop', alerta: false },
    { titulo: 'Actividad Comercial', valor: '$90.000,00', subtitulo: 'Volumen Acumulado', badge: '4 Acuerdos Hoy', icono: 'payments', alerta: false },
    { titulo: 'Seguridad de Reportes', valor: '1', subtitulo: 'Revisión Inmediata', badge: '18 min resolución', icono: 'flip_camera_ios', alerta: true }
  ];

  const reportes = [
    { id: 'PUB-8492', fecha: 'Hoy, 04:15 hs', prod: 'Cajón de Banana Primicia', origen: 'Chacra Don Pedro', infraccion: 'PRECIO_FALSO' }
  ];

  const usuarios = [
    { nombre: 'Pedro Gómez', empresa: 'Chacra Don Pedro', rol: 'Productor', local: 'Laguna Naineck', iniciales: 'PG' },
    { nombre: 'Sofía Benítez', empresa: 'Sabores del Monte', rol: 'Emprendimiento', local: 'Clorinda', iniciales: 'SB' },
    { nombre: 'Carlos Fernández', empresa: 'Restó Raíces', rol: 'Consumidor', local: 'Formosa Capital', iniciales: 'CF' },
    { nombre: 'Ramón Acosta', empresa: 'Mieles del Chaco', rol: 'Productor', local: 'El Colorado', iniciales: 'RA' },
    { nombre: 'Lucía Ortiz', empresa: 'Panadería Verde', rol: 'Emprendimiento', local: 'Pirané', iniciales: 'LO' },
    { nombre: 'Marta Riquelme', empresa: 'Huerta Familiar', rol: 'Productor', local: 'Las Lomitas', iniciales: 'MR' },
    { nombre: 'Esteban Sosa', empresa: 'Mercadito Local', rol: 'Consumidor', local: 'Ibarreta', iniciales: 'ES' },
    { nombre: 'Juan Villalba', empresa: 'Finca La Esperanza', rol: 'Productor', local: 'Laguna Blanca', iniciales: 'JV' }
  ];

  return (
    <AdminLayout>
      
      {/* 1. PANEL GENERAL (AHORA ES UN HERO CARD GIGANTE Y OSCURO) */}
      <section id="panel-general" className="admin-section">
        <div className="admin-hero-card">
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '16px', lineHeight: '1.1' }}>
            Panel de Control Formosa
          </h1>
          <p style={{ color: 'var(--honeydew)', fontSize: '1.2rem', maxWidth: '800px', opacity: '0.9' }}>
            Bienvenido al centro de operaciones. Gestiona la moderación de publicaciones, monitorea la seguridad comunitaria y revisa las métricas comerciales de la red al final de esta página.
          </p>
          <div style={{ marginTop: '32px' }}>
            <a href="#metricas-globales" className="admin-btn btn-green" style={{ textDecoration: 'none', padding: '12px 24px', fontSize: '1.1rem' }}>
              <span className="material-symbols-outlined">south</span> Ver Métricas Globales
            </a>
          </div>
        </div>
      </section>

      {/* 2. MODERACIÓN DE REPORTES */}
      <section id="moderacion-reportes" className="admin-section">
        <div className="admin-card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--kombu-green)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="material-symbols-outlined" style={{ color: '#dc2626' }}>gavel</span> 
            Moderación de Reportes
          </h2>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead><tr><th>Fecha</th><th>Publicación</th><th>Vendedor</th><th>Infracción</th><th>Acciones</th></tr></thead>
              <tbody>
                {reportes.map((rep, index) => (
                  <tr key={index}>
                    <td><strong>{rep.fecha}</strong></td>
                    <td><strong>{rep.prod}</strong></td>
                    <td>{rep.origen}</td>
                    <td><span className="admin-badge badge-red">{rep.infraccion}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="admin-btn btn-green">Resolver</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. GESTIÓN DE USUARIOS */}
      <section id="gestion-usuarios" className="admin-section">
        <div className="admin-card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--kombu-green)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--emerald)' }}>manage_accounts</span> 
            Gestión de Usuarios
          </h2>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead><tr><th>Usuario</th><th>Rol</th><th>Localidad</th><th>Acción</th></tr></thead>
              <tbody>
                {usuarios.map((user, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50px', backgroundColor: 'var(--honeydew)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>{user.iniciales}</div>
                        <div>
                          <strong style={{ display: 'block' }}>{user.nombre}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--dark-moss)' }}>{user.empresa}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="admin-badge badge-gray">{user.rol}</span></td>
                    <td>{user.local}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="admin-btn btn-outline-red">Suspender</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. MÉTRICAS GLOBALES */}
      <section id="metricas-globales" className="admin-section">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--kombu-green)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--emerald)' }}>insights</span> 
          Métricas Globales
        </h2>
        <div className="kpi-grid">
          {globalStats.map((stat, index) => (
            <div key={index} className="admin-card" style={stat.alerta ? { borderColor: '#fca5a5', backgroundColor: '#fef2f2' } : {}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: stat.alerta ? '#b91c1c' : 'var(--dark-moss)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.titulo}
                </span>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: stat.alerta ? '#fecaca' : 'var(--honeydew)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ color: stat.alerta ? '#b91c1c' : 'var(--emerald)' }}>{stat.icono}</span>
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '3rem', fontWeight: '800', color: stat.alerta ? '#b91c1c' : 'var(--kombu-green)', lineHeight: '1' }}>
                  {stat.valor}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: stat.alerta ? '#991b1b' : 'var(--secondary)', marginTop: '8px' }}>
                  {stat.subtitulo}
                </div>
              </div>

              <div style={{ paddingTop: '16px', borderTop: `1px solid ${stat.alerta ? '#fca5a5' : 'var(--honeydew)'}`, marginTop: '16px' }}>
                <span className={`admin-badge ${stat.alerta ? 'badge-red' : 'badge-green'}`}>
                  {stat.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </AdminLayout>
  );
};  