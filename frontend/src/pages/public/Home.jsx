import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { HeroSection } from '../../components/public/HeroSection';
import { TrustStrip } from '../../components/public/TrustStrip';
import { MapaProductivo } from '../../components/public/MapaProductivo';
import { DiferenciasRoles } from '../../components/public/DiferenciasRoles';
import { RadarFrescura } from '../../components/public/RadarFrescura';
import { VitrinaProductiva } from '../../components/public/VitrinaProductiva';
import { LlamadoFinal } from '../../components/public/LlamadoFinal';

export const Home = () => {
  return (
    <PublicLayout>
      {/* 1. El inicio tal cual está */}
      <HeroSection />
      
      {/* 2. Qué es, de dónde nace (Franja de confianza) */}
      <TrustStrip />
      
      {/* 3. El Mapa */}
      <MapaProductivo />
      
      {/* 4. Diferencias entre productor y emprendedor (Tarjeta animada) */}
      <DiferenciasRoles />
      
      {/* 5. Radar de frescura */}
      <RadarFrescura />
      
      {/* 6. Vitrina de productos */}
      <VitrinaProductiva />
      
      {/* 7. Final que convenza al usuario */}
      <LlamadoFinal />
    </PublicLayout>
  );
};