import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/MapaCalorModal.css';

const formosaCenter = [-25.4, -59.1];

// Traduce la intensidad (0 a 1) de un punto a un color de la gama
// de verdes ya usada en el sitio, para simular el "calor" sin salir de la paleta.
const colorPorIntensidad = (intensidad) => {
  if (intensidad >= 0.75) return '#1e3318'; // kombu-green (máxima concentración)
  if (intensidad >= 0.55) return '#2d4722'; // dark-moss
  if (intensidad >= 0.35) return '#47622A'; // palm-leaf
  return '#75C97F'; // emerald (menor concentración)
};

export const MapaCalorModal = ({ data, onClose }) => {
  if (!data) return null;
  const { producto, puntos, destacado } = data;

  return (
    <AnimatePresence>
      <motion.div
        className="calor-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="calor-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="calor-close" onClick={onClose} aria-label="Cerrar">
            <span className="material-symbols-outlined">close</span>
          </button>

          <div className="calor-header">
            <span className="material-symbols-outlined calor-header-icon">local_fire_department</span>
            <div>
              <span className="ficha-label">Mapa de Calor</span>
              <h3 className="calor-title">Disponibilidad fresca de {producto}</h3>
            </div>
          </div>

          <div className="calor-body">
            <div className="calor-map-wrapper">
              <MapContainer
                center={formosaCenter}
                zoom={7}
                scrollWheelZoom={false}
                style={{ width: '100%', height: '100%', minHeight: '360px', zIndex: 0 }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {puntos.map((p, i) => (
                  <CircleMarker
                    key={i}
                    center={p.coords}
                    radius={16 + p.intensidad * 18}
                    pathOptions={{
                      color: colorPorIntensidad(p.intensidad),
                      fillColor: colorPorIntensidad(p.intensidad),
                      fillOpacity: 0.35 + p.intensidad * 0.35,
                      weight: 1
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -6]}>
                      <strong>{p.name}</strong><br />
                      {p.loc} · ⭐ {p.score}
                    </Tooltip>
                  </CircleMarker>
                ))}
              </MapContainer>
              <div className="calor-map-leyenda">
                <span className="calor-leyenda-dot" style={{ backgroundColor: '#75C97F' }}></span> Menor concentración
                <span className="calor-leyenda-dot" style={{ backgroundColor: '#1e3318', marginLeft: '16px' }}></span> Mayor concentración
              </div>
            </div>

            <div className="calor-perfil">
              <span className="calor-perfil-badge">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>military_tech</span>
                Productor Destacado
              </span>

              <div className="calor-perfil-header">
                <img className="calor-perfil-avatar" src={destacado.img} alt={destacado.name} />
                <div>
                  <h4 className="calor-perfil-nombre">{destacado.name}</h4>
                  <p className="calor-perfil-ubicacion">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>
                    {destacado.loc}
                  </p>
                </div>
              </div>

              <div className="calor-perfil-score">
                <span className="material-symbols-outlined" style={{ color: '#EEE59F' }}>star</span>
                <span className="calor-perfil-score-num">{destacado.score}</span>
                <span className="calor-perfil-score-max">/ 5 puntaje de la comunidad</span>
              </div>

              <p className="calor-perfil-desc">{destacado.desc}</p>

              <button className="navbar-btn navbar-btn-block">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat</span>
                <span>Contactar Productor</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};