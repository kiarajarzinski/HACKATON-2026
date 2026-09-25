import { Navbar } from '../../components/auth/Navbar';
import { LocationModal } from '../../components/common/LocationModal';
import { FeedProductos } from '../../components/common/FeedProductos';
import { MapaDashboard } from '../../components/common/MapaDashboard';
export const ConsumidorDashboard = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginTop: 0 }}>Panel del Consumidor</h1>
        
        {/* Aquí inyectamos el Feed */}
        <FeedProductos titulo="Productos terminados de Emprendimientos Locales" />
        <MapaDashboard />
        <LocationModal />
      </div>
    </div>
  );
};