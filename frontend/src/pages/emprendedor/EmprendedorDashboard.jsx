import { Navbar } from '../../components/auth/Navbar';
import { LocationModal } from '../../components/common/LocationModal';
import { FeedProductos } from '../../components/common/FeedProductos';
import { MapaDashboard } from '../../components/common/MapaDashboard';
import { MisPedidos } from '../../components/common/MisPedidos'; // <-- IMPORTAR

export const EmprendedorDashboard = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5fcef', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      
      <main style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto', paddingTop: '7rem' }}>
        
        {/* Cabecera del Panel */}
        <div style={{ backgroundColor: '#eff6e9', borderRadius: '24px', padding: '2rem', marginBottom: '2rem' }}>
          <h1 style={{ marginTop: 0, fontSize: '28px', color: '#171d16' }}>Panel de Emprendimiento y Pedidos</h1>
          <p style={{ margin: 0, color: '#40493f' }}>Gestiona tu materia prima, coordina entregas y revisa los pedidos que te hicieron.</p>
        </div>


        {/* Feed y Mapa */}
        <FeedProductos titulo="Materia prima disponible de Productores" />
        <MapaDashboard />
        <LocationModal />

      </main>
    </div>
  );
};