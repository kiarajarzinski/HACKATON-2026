import React from 'react';
import { LocationModal } from '../../components/common/LocationModal';
import { FeedProductos } from '../../components/common/FeedProductos';
import { MapaDashboard } from '../../components/common/MapaDashboard';

export const EmprendedorDashboard = () => {
  return (
    <div className="emp-wrapper">
      {/* ================= ESTILOS INYECTADOS ================= */}
      <style>{`
        .emp-wrapper {
          min-height: 100vh;
          background-color: #f4f8f1;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding-top: 100px;
          display: flex;
          flex-direction: column;
        }
        
        /* ================= NAVBAR TIPO PÍLDORA ================= */
        .emp-navbar-header {
          position: fixed;
          top: 20px;
          left: 0;
          right: 0;
          z-index: 999;
          padding: 0 4%;
          pointer-events: none;
        }

        .emp-navbar-pill {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          pointer-events: auto;
          background-color: rgba(240, 247, 234, 0.95);
          backdrop-filter: blur(12px);
          border-radius: 50px;
          padding: 10px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 10px 30px rgba(17, 111, 34, 0.15);
          border: 1px solid rgba(117, 201, 127, 0.2);
        }

        .emp-logo {
          font-weight: 800;
          color: var(--kombu-green);
          text-decoration: none;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .emp-nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .emp-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50px;
          background-color: var(--emerald);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 10px rgba(117, 201, 127, 0.3);
          text-decoration: none;
        }

        .emp-icon-btn:hover {
          background-color: var(--willow-green);
          transform: scale(1.08);
          box-shadow: 0 6px 14px rgba(117, 201, 127, 0.4);
        }

        /* ================= CONTENIDO PRINCIPAL ================= */
        .emp-main {
          width: 100%;
          padding: 0 4%;
          padding-bottom: 80px;
          margin: 0 auto;
          max-width: 1600px;
          display: flex;
          flex-direction: column;
          gap: 40px;
          flex: 1;
        }

        .emp-hero {
          background: linear-gradient(135deg, var(--kombu-green) 0%, var(--dark-moss) 100%);
          border-radius: 24px;
          padding: 56px 48px;
          color: white;
          box-shadow: 0 20px 40px rgba(17, 111, 34, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .emp-hero:hover {
          transform: translateY(-4px);
          box-shadow: 0 25px 50px rgba(17, 111, 34, 0.3);
        }

        .emp-hero-title {
          font-size: 2.8rem;
          font-weight: 800;
          margin-bottom: 16px;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .emp-hero-desc {
          font-size: 1.15rem;
          opacity: 0.9;
          max-width: 700px;
          margin-bottom: 32px;
          color: var(--honeydew);
        }

        .emp-search-bar {
          position: relative;
          max-width: 500px;
        }

        .emp-search-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border-radius: 50px;
          border: none;
          outline: none;
          font-size: 1rem;
          font-family: inherit;
          color: var(--kombu-green);
          background-color: #ffffff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: box-shadow 0.2s ease;
        }

        .emp-search-input:focus {
          box-shadow: 0 0 0 4px rgba(117, 201, 127, 0.3);
        }

        /* ================= TARJETAS Y CONTENEDORES ================= */
        .emp-card {
          background-color: #ffffff;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid var(--honeydew);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .emp-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 35px rgba(17, 111, 34, 0.1);
        }
      `}</style>

      {/* ================= NAVBAR (PÍLDORA FLOTANTE) ================= */}
      <header className="emp-navbar-header">
        <div className="emp-navbar-pill">
          
          <a href="/" className="emp-logo">
            <span className="material-symbols-outlined" style={{ color: 'var(--emerald)', fontSize: '28px' }}>eco</span>
            EcoNexo
          </a>
          
          <div className="emp-nav-actions">
            {/* Botón Carrito de Compras B2B */}
            {/* <button className="emp-icon-btn" title="Carrito de Insumos">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shopping_cart</span>
            </button>
             */}
            {/* Botón Perfil del Emprendedor */}
            <a href="/perfil" className="emp-icon-btn" title="Mi Vitrina / Perfil">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>storefront</span>
            </a>
          </div>

        </div>
      </header>

      {/* ================= CONTENIDO PRINCIPAL ================= */}
      <main className="emp-main">
        
        {/* Banner Superior Enfocado en Abastecimiento (B2B) */}
        <div className="emp-hero">
          <h1 className="emp-hero-title">Abastece tu emprendimiento con lo mejor</h1>
          <p className="emp-hero-desc">
            Conecta directamente con productores locales para obtener materia prima fresca, reducir costos de intermediación y potenciar tus elaboraciones.
          </p>
          <div className="emp-search-bar">
            <span 
              className="material-symbols-outlined" 
              style={{ position: 'absolute', left: '16px', top: '16px', color: '#6b7280' }}
            >
              search
            </span>
            <input 
              type="text" 
              placeholder="Buscar cajones de fruta, hortalizas, miel a granel..."
              className="emp-search-input"
            />
          </div>
        </div>

        {/* Componente Feed Original Intacto (Conectado a tu DB) */}
        <div style={{ marginTop: '16px' }}>
          <FeedProductos titulo="Materia prima disponible de Productores" />
        </div>
        
        {/* Componente Mapa Original Intacto */}
        <div className="emp-card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--kombu-green)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--emerald)', fontSize: '28px' }}>agriculture</span>
            Explorar Productores en tu zona
          </h2>
          <MapaDashboard />
        </div>

        {/* Modales Originales Intactos */}
        <LocationModal />

      </main>

      {/* ================= FOOTER GENÉRICO ECONEXO ================= */}
      <footer style={{ backgroundColor: 'var(--kombu-green)', color: 'var(--honeydew)', padding: '64px 24px 32px', textAlign: 'center', marginTop: 'auto', borderTop: '4px solid var(--emerald)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--emerald)', fontSize: '36px' }}>eco</span>
          <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white', letterSpacing: '-0.02em' }}>EcoNexo</span>
        </div>
        <p style={{ opacity: 0.8, fontSize: '1rem', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
          Conectando la red agroecológica y emprendedora de Formosa de manera directa, segura y sin intermediarios.
        </p>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', fontSize: '0.85rem', opacity: 0.6, fontWeight: '500' }}>
          © 2026 EcoNexo. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};