import { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

export const LocationModal = ({ forceOpen = false, onClose, onSuccess, initialData }) => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState([-26.1848, -58.1731]); // Formosa por defecto
  const [formData, setFormData] = useState({ localidad: '', direccionReferencia: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si viene desde el botón editar, lo forzamos a abrir
    if (forceOpen) {
      setIsOpen(true);
      // Si recibimos datos previos, los cargamos en el mapa y en el formulario
      if (initialData?.lat && initialData?.lng) {
        setPosition([initialData.lat, initialData.lng]);
        setFormData({
          localidad: initialData.localidad || '',
          direccionReferencia: initialData.direccionReferencia || ''
        });
      }
    } else {
      // Comportamiento normal (para los Dashboards)
      const hasLocation = localStorage.getItem(`ubicacion_${user?.id}`);
      if (!hasLocation && user) setIsOpen(true);
    }
  }, [user, forceOpen, initialData]);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return <Marker position={position} />;
  };

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.error("Error obteniendo ubicación", err)
      );
    }
  };
const handleSubmit = async () => {
    if (!formData.localidad.trim()) {
      alert('Por favor, ingresa una Localidad/Ciudad antes de guardar.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/location', {
        latitud: position[0],
        longitud: position[1],
        localidad: formData.localidad,
        direccionReferencia: formData.direccionReferencia
      });
      
      localStorage.setItem(`ubicacion_${user.id}`, 'true');
      
      if (onSuccess) onSuccess(); 
      if (onClose) onClose(); 
      if (!forceOpen) setIsOpen(false); 
      
    } catch (error) {
      console.error('Error al guardar la ubicación', error);
      alert('Hubo un error al guardar tu ubicación.');
    } finally {
      setLoading(false);
    }
  };

  const handleCerrar = () => {
    if (onClose) onClose();
    else setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        
        {/* Cabecera del modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>{forceOpen ? 'Editar Ubicación' : 'Configura tu Ubicación'}</h2>
          {forceOpen && (
            <button onClick={handleCerrar} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✖</button>
          )}
        </div>
        
        <p style={{ margin: '15px 0', color: '#555' }}>
          {user?.rol === 'CONSUMIDOR' 
            ? 'Indícanos tu zona para mostrarte emprendimientos cercanos.'
            : 'Fija el punto exacto de tu establecimiento para que los consumidores te encuentren.'}
        </p>

        <button type="button" onClick={handleGetLocation} style={btnLocationStyle}>
          📍 Usar mi ubicación actual
        </button>

        <div style={{ height: '300px', width: '100%', marginBottom: '15px', zIndex: 0 }}>
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '8px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker />
          </MapContainer>
        </div>

        <p style={{ fontSize: '12px', color: '#888', textAlign: 'center', marginBottom: '10px' }}>
          *Puedes hacer clic en el mapa para ajustar el pin exacto
        </p>

        <input
          type="text"
          placeholder="Localidad / Ciudad"
          value={formData.localidad}
          onChange={(e) => setFormData({ ...formData, localidad: e.target.value })}
          style={inputStyle}
          required
        />

        {user?.rol !== 'CONSUMIDOR' && (
          <input
            type="text"
            placeholder="Dirección de Referencia (Ej: Ruta 11 Km 5, tranquera roja)"
            value={formData.direccionReferencia}
            onChange={(e) => setFormData({ ...formData, direccionReferencia: e.target.value })}
            style={inputStyle}
          />
        )}

        <button onClick={handleSubmit} disabled={loading} style={btnSubmitStyle}>
          {loading ? 'Guardando...' : 'Confirmar Ubicación'}
        </button>
      </div>
    </div>
  );
};

// Estilos
const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' };
const modalStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' };
const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' };
const btnLocationStyle = { width: '100%', padding: '10px', marginBottom: '15px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const btnSubmitStyle = { width: '100%', padding: '12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' };