import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Agregamos las importaciones reales de Leaflet
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Coordenadas centrales para el mini mapa
const formosaCenter = [-24.8, -60.0];

export const DiferenciasRoles = () => {
  const [isProductor, setIsProductor] = useState(false);

  return (
    <section className="container-max dif-section" id="diferencias">
      
      <motion.div 
        layout 
        className={`dif-container ${isProductor ? 'reverse' : ''}`}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        
        {/* Lado Imagen + Botón Switch */}
        <motion.div layout className="dif-img-side">
          <AnimatePresence mode="wait">
            <motion.img 
              key={isProductor ? 'prod' : 'emp'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={isProductor 
                ? "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&w=800&q=80" 
                : "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80" 
              } 
              alt="Rol EcoNexo" 
            />
          </AnimatePresence>
          <div className="dif-img-overlay">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsProductor(!isProductor)}
              className="dif-switch-btn"
            >
              <span className="material-symbols-outlined">swap_horiz</span>
              {isProductor ? '¿Eres Emprendedor?' : '¿Eres Productor Primario?'}
            </motion.button>
          </div>
        </motion.div>

        {/* Lado Contenido */}
        <motion.div layout className="dif-content-side">
          <AnimatePresence mode="wait">
            {isProductor ? (
              <motion.div 
                key="productor"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="dif-title">Beneficios para el Productor</h3>
                <div className="dif-list">
                  <div className="dif-item">
                    <span className="material-symbols-outlined" style={{color: 'var(--emerald)'}}>wifi_tethering</span>
                    <p><strong>Rompe la brecha de conectividad</strong> en zonas rurales con un sistema ligero.</p>
                  </div>
                  <div className="dif-item">
                    <span className="material-symbols-outlined" style={{color: 'var(--emerald)'}}>public</span>
                    <p>Máxima <strong>visibilidad provincial</strong> ante comercios, restaurantes e industrias.</p>
                  </div>
                  <div className="dif-item">
                    <span className="material-symbols-outlined" style={{color: 'var(--emerald)'}}>shield</span>
                    <p><strong>Seguridad garantizada</strong> sobre los datos y la identidad de a quién le vendes.</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="emprendedor"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h3 className="dif-title">Impulsa tu Emprendimiento</h3>
                
                {/* WIDGET DEL MAPA REAL */}
                <div style={{ marginBottom: '24px', borderRadius: '16px', overflow: 'hidden', border: '2px solid var(--emerald)'}}>
                  <MapContainer 
                    center={formosaCenter} 
                    zoom={6} 
                    zoomControl={false}
                    scrollWheelZoom={false} 
                    dragging={false}
                    style={{ width: '100%', height: '140px', zIndex: 0 }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {/* Un par de marcadores de ejemplo para ilustrar */}
                    <Marker position={[-24.7064, -60.5936]}></Marker>
                    <Marker position={[-25.1256, -58.2464]}></Marker>
                  </MapContainer>
                  <div style={{ padding: '8px 12px', backgroundColor: 'var(--honeydew)', fontSize: '0.85rem', color: 'var(--dark-moss)', fontWeight: '600' }}>
                    📍 Detectando productores en tu zona...
                  </div>
                </div>

                <div className="dif-list">
                  <div className="dif-item">
                    <span className="material-symbols-outlined" style={{color: 'var(--emerald)'}}>notifications_active</span>
                    <p>Recibe <strong>notificaciones en tiempo real</strong> sobre temporadas de cosecha.</p>
                  </div>
                  <div className="dif-item">
                    <span className="material-symbols-outlined" style={{color: 'var(--emerald)'}}>gpp_good</span>
                    <p>Compra <strong>materia prima fresca</strong> de manera segura y sin intermediarios.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </motion.div>
    </section>
  );
};