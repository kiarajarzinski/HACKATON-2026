import { Navbar } from '../../components/auth/Navbar';
import { LocationModal } from '../../components/common/LocationModal';
import { FeedProductos } from '../../components/common/FeedProductos';
import { MapaDashboard } from '../../components/common/MapaDashboard';
import { MisPedidos } from '../../components/common/MisPedidos'; // <-- 1. IMPORTAR EL MÓDULO

export const ConsumidorDashboard = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5fcef', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      
      <main style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto', paddingTop: '7rem' }}>
        
        {/* Cabecera del Panel */}
        <div style={{ backgroundColor: '#eff6e9', borderRadius: '24px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ backgroundColor: '#c2ed96', color: '#486c25', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Panel de Consumidor Consciente
          </span>
          <h1 style={{ marginTop: '10px', marginBottom: '8px', fontSize: '28px', color: '#171d16' }}>
            Alimentos frescos de productores y emprendedores locales
          </h1>
          <p style={{ margin: 0, color: '#40493f', fontSize: '16px' }}>
            Explorá los productos elaborados, coordiná tus pedidos directos sin intermediarios por WhatsApp y descubrí el mapa productivo de Formosa.
          </p>
        </div>

        {/* Feed de Productos Dinámico */}
        <FeedProductos titulo="Productos terminados de Emprendimientos Locales" />

        {/* Mapa Interactivo Territorial */}
        <MapaDashboard />

        {/* Modal de Configuración de Ubicación */}
        <LocationModal />

      </main>
    </div>
  );
};