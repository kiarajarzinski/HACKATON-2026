import { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext'; // <-- Importamos el contexto

// Función para crear puntos de colores limpios
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

const iconProductor = createCustomIcon('#2ecc71'); // Verde
const iconEmprendimiento = createCustomIcon('#f39c12'); // Naranja

export const MapaDashboard = () => {
  const { user } = useContext(AuthContext); // <-- Obtenemos el usuario actual
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await api.get('/users/map-locations');
        setLocations(data);
      } catch (error) {
        console.error('Error al cargar ubicaciones:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando mapa interactivo...</div>;

  return (
    <div style={{ marginTop: '3rem', backgroundColor: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eee', paddingBottom: '10px', marginTop: 0 }}>
        Mapa de Actores Locales
      </h2>
      
      {/* Contenedor del Mapa */}
      <div style={{ height: '450px', width: '100%', borderRadius: '8px', overflow: 'hidden', zIndex: 0 }}>
        <MapContainer center={[-25.5, -59.5]} zoom={7} style={{ height: '100%', width: '100%' }}>
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            attribution='&copy; OpenStreetMap'
          />
          
          {locations.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.latitud, loc.longitud]}
              icon={loc.tipo === 'PRODUCTOR' ? iconProductor : iconEmprendimiento}
            >
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <strong style={{ fontSize: '14px' }}>{loc.nombreCuenta}</strong><br />
                  <span style={{ fontSize: '12px', color: '#7f8c8d', display: 'block', margin: '5px 0' }}>
                    {loc.tipo === 'PRODUCTOR' ? '🚜 Productor' : '🏪 Emprendimiento'}
                  </span>
                  <span style={{ fontSize: '11px', backgroundColor: '#ecf0f1', padding: '2px 6px', borderRadius: '4px' }}>
                    {loc.rubro ? loc.rubro.replace(/_/g, ' ') : loc.tipoEstablecimiento?.replace(/_/g, ' ')}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Leyenda de Colores Condicional */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '15px', fontSize: '14px', justifyContent: 'center' }}>
        
        {/* Solo se muestra a Productores y Emprendimientos */}
        {(user?.rol === 'PRODUCTOR' || user?.rol === 'EMPRENDIMIENTO') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#2ecc71', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 3px rgba(0,0,0,0.3)' }}></div>
            <span>Productores (Materia Prima)</span>
          </div>
        )}

        {/* Solo se muestra a Consumidores */}
        {user?.rol === 'CONSUMIDOR' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#f39c12', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 3px rgba(0,0,0,0.3)' }}></div>
            <span>Emprendimientos (Valor Agregado)</span>
          </div>
        )}
        
      </div>
    </div>
  );
};