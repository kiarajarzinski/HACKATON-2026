import { LocationModal } from '../../components/common/LocationModal';
import { Navbar } from '../../components/auth/Navbar'; 

export const ProductorDashboard = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f6fa' }}> 
      
      <Navbar /> 

      <div style={{ padding: '2rem' }}>
        <h1>Panel del Productor</h1>
        <p>Bienvenido a tu área de gestión.</p>
        
        <LocationModal />
      </div>
      
    </div>
  );
};