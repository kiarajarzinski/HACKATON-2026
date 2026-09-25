import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/MapaProductivo.css';
import { b2bData } from '../../assets/data';

const formosaCenter = [-24.8, -60.0];

const mapNodes = [
  { id: 'lomitas', coords: [-24.7064, -60.5936], icon: '🍯', name: 'Las Lomitas', hex: '#AAD480' },
  { id: 'laguna', coords: [-25.1256, -58.2464], icon: '🍌', name: 'Laguna Blanca', hex: '#75C97F' },
  { id: 'ibarreta', coords: [-25.2131, -59.8583], icon: '🥬', name: 'Ibarreta', hex: '#47622A' },
  { id: 'colorado', coords: [-26.3056, -59.3725], icon: '🌾', name: 'El Colorado', hex: '#1e3318' }
];

const createCustomIcon = (emoji, bgColor) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${bgColor}; width: 40px; height: 40px; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 2px solid white; font-size: 18px; font-weight: bold;">${emoji}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

export const MapaProductivo = () => {
  const [activeProducer, setActiveProducer] = useState(b2bData.lomitas);

  return (
    <section className="container-max mapa-section" id="donde-nace">
      <div className="mapa-layout">
        <div className="mapa-leaflet-container">
          <MapContainer center={formosaCenter} zoom={7} scrollWheelZoom={false} style={{ width: '100%', height: '100%', minHeight: '440px', borderRadius: '16px', zIndex: 0 }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            {mapNodes.map((node) => (
              <Marker key={node.id} position={node.coords} icon={createCustomIcon(node.icon, node.hex)} eventHandlers={{ click: () => setActiveProducer(b2bData[node.id]) }}>
                <Popup>{node.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="mapa-ficha">
          <AnimatePresence mode='wait'>
            <motion.div key={activeProducer.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <div className="ficha-header">
                <img alt={activeProducer.name} className="ficha-avatar" src={activeProducer.img} />
                <div>
                  <h3 className="ficha-titulo">{activeProducer.name}</h3>
                  <p className="ficha-ubicacion">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#47622A' }}>location_on</span>
                    {activeProducer.loc}
                  </p>
                </div>
              </div>
              <div className="ficha-producto-box">
                <span className="ficha-label">Materia Prima</span>
                <h4 className="ficha-producto-nombre">{activeProducer.product}</h4>
                <p className="ficha-producto-desc">{activeProducer.desc}</p>
              </div>
              <div className="ficha-datos">
                <div className="ficha-fila">
                  <span className="ficha-fila-clave">Volumen Mayorista:</span><span className="ficha-fila-valor">{activeProducer.p1}</span>
                </div>
                <div className="ficha-fila">
                  <span className="ficha-fila-clave">Volumen Gastronómico:</span><span className="ficha-fila-valor">{activeProducer.p2}</span>
                </div>
                <div className="ficha-fila" style={{ borderBottom: 'none' }}>
                  <span className="ficha-fila-clave">Stock Inmediato:</span><span className="ficha-fila-stock">{activeProducer.stock}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <motion.button whileTap={{ scale: 0.95 }} className="navbar-btn" style={{ width: '100%', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat</span><span>Contactar Productor</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
};