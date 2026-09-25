import { Navbar } from "../../components/auth/Navbar";
import { LocationModal } from "../../components/common/LocationModal";

export const ConsumidorDashboard = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f6fa' }}> 
      
      <Navbar /> 
      <h1>Panel del Consumidor</h1>
      <p>Bienvenido a tu dashboard. Aquí podrás ver tus compras.</p>
      <LocationModal />
    </div>
  );
};