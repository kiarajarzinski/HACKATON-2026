import React from 'react';
import { LocationModal } from '../../components/common/LocationModal';
import { MapaDashboard } from '../../components/common/MapaDashboard';

export const ConsumidorDashboard = () => {

  const mockProductos = [
    { id: 1, nombre: 'Mermelada de Mamón', precio: '$3.200', emprendimiento: 'Sabores del Monte', img: 'https://images.unsplash.com/photo-1581007871115-f14bc016e0a4?auto=format&fit=crop&w=400&q=80' },
    { id: 2, nombre: 'Panificados Sin TACC', precio: '$4.500', emprendimiento: 'Horno Verde', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80' },
    { id: 3, nombre: 'Vianda Vegetariana', precio: '$5.000', emprendimiento: 'Raíces Restó', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80' },
    { id: 4, nombre: 'Dulce de Leche Vegano', precio: '$4.100', emprendimiento: 'Kombu Deli', img: 'https://images.unsplash.com/photo-1610214643033-d73187c2fb7e?auto=format&fit=crop&w=400&q=80' },
    { id: 5, nombre: 'Queso de Semillas', precio: '$3.800', emprendimiento: 'Semilla Viva', img: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=400&q=80' },
    { id: 6, nombre: 'Escabeche de Berenjenas', precio: '$2.900', emprendimiento: 'Sabores del Monte', img: 'https://images.unsplash.com/photo-1582283533816-64673898f0fa?auto=format&fit=crop&w=400&q=80' },
    { id: 7, nombre: 'Tarta Integral Zapallo', precio: '$6.500', emprendimiento: 'Raíces Restó', img: 'https://images.unsplash.com/photo-1612822165074-ce6df4b036fa?auto=format&fit=crop&w=400&q=80' },
    { id: 8, nombre: 'Alfajores Algarroba', precio: '$2.200', emprendimiento: 'Horno Verde', img: 'https://images.unsplash.com/photo-1512223792601-592a980900db?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="cons-wrapper">
      <style>{`
        .cons-wrapper {
          min-height: 100vh;
          width: 100%;
          background-color: #f4f8f1;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding-top: 120px;
          display: flex;
          flex-direction: column;
        }
        
        /* ================= NAVBAR ================= */
        .cons-navbar-header {
          position: fixed;
          top: 20px;
          left: 0;
          right: 0;
          z-index: 999;
          padding: 0 4%; /* Expandimos los márgenes del nav */
          pointer-events: none;
        }

        .cons-navbar-pill {
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

        .cons-logo {
          font-weight: 800;
          color: var(--kombu-green);
          text-decoration: none;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cons-nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cons-icon-btn {
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

        .cons-icon-btn:hover {
          background-color: var(--willow-green);
          transform: scale(1.08);
          box-shadow: 0 6px 14px rgba(117, 201, 127, 0.4);
        }

        /* ================= CONTENIDO PRINCIPAL ================= */
        .cons-main {
          width: 100%;
          padding: 0 4%; /* Márgenes más amplios a los lados */
          padding-bottom: 80px;
          margin: 0 auto;
          max-width: 1600px; /* Expandido para aprovechar pantallas grandes */
          display: flex;
          flex-direction: column;
          gap: 40px;
          flex: 1;
        }

        .cons-hero {
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
        
        .cons-hero:hover {
          transform: translateY(-4px);
          box-shadow: 0 25px 50px rgba(17, 111, 34, 0.3);
        }

        .cons-hero-title {
          font-size: 2.8rem;
          font-weight: 800;
          margin-bottom: 16px;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .cons-hero-desc {
          font-size: 1.15rem;
          opacity: 0.9;
          max-width: 700px;
          margin-bottom: 32px;
          color: var(--honeydew);
        }

        .cons-search-bar {
          position: relative;
          max-width: 500px;
        }

        .cons-search-input {
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

        .cons-search-input:focus {
          box-shadow: 0 0 0 4px rgba(117, 201, 127, 0.3);
        }

        /* ================= GRILLA DE PRODUCTOS NATIVA ================= */
        .prod-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .prod-card {
          background-color: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--honeydew);
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .prod-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 35px rgba(17, 111, 34, 0.1);
        }

        .prod-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .prod-info {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .prod-badge {
          align-self: flex-start;
          padding: 4px 12px;
          background-color: var(--honeydew);
          color: var(--kombu-green);
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        /* ================= MAPA CARD ================= */
        .cons-card {
          background-color: #ffffff;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid var(--honeydew);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .cons-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 35px rgba(17, 111, 34, 0.1);
        }
      `}</style>

      {/* NAVBAR */}
      <header className="cons-navbar-header">
        <div className="cons-navbar-pill">
          <a href="/" className="cons-logo">
            <span className="material-symbols-outlined" style={{ color: 'var(--emerald)', fontSize: '28px' }}>eco</span>
            EcoNexo
          </a>
          <div className="cons-nav-actions">
            <button className="cons-icon-btn" title="Carrito de Compras">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shopping_cart</span>
            </button>
            <a href="/perfil" className="cons-icon-btn" title="Mi Perfil">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person</span>
            </a>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="cons-main">
        
        {/* Banner */}
        <div className="cons-hero">
          <h1 className="cons-hero-title">Descubre los sabores de tu ciudad</h1>
          <p className="cons-hero-desc">
            Apoya a los emprendedores locales comprando alimentos frescos y elaborados directamente en tu zona.
          </p>
          <div className="cons-search-bar">
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '16px', top: '16px', color: '#6b7280' }}>search</span>
            <input type="text" placeholder="Buscar viandas, mermeladas, panificados..." className="cons-search-input" />
          </div>
        </div>

        {/* FEED DE PRODUCTOS NATIVO (Ignora el componente externo) */}
        <section>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--kombu-green)', marginBottom: '24px' }}>
            Productos de Emprendimientos Locales
          </h2>
          <div className="prod-grid">
            {mockProductos.map((prod) => (
              <div key={prod.id} className="prod-card">
                <img src={prod.img} alt={prod.nombre} className="prod-img" />
                <div className="prod-info">
                  <span className="prod-badge">{prod.emprendimiento}</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--kombu-green)', margin: 0 }}>
                    {prod.nombre}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--emerald)' }}>{prod.precio}</span>
                    <button style={{ backgroundColor: 'var(--kombu-green)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '50px', fontWeight: '700', cursor: 'pointer' }}>
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Mapa */}
        <div className="cons-card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--kombu-green)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--emerald)', fontSize: '28px' }}>explore</span>
            Explorar en tu zona
          </h2>
          <MapaDashboard />
        </div>

        <LocationModal />

      </main>

      {/* FOOTER */}
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