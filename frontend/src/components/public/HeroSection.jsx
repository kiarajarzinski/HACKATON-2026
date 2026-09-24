import React from 'react';
import { motion } from 'framer-motion';

export const HeroSection = () => (
  // Pega aquí exactamente todo tu componente const HeroSection = () => ( <section>...</section> );
  <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-4 md:px-8 overflow-hidden bg-kombu-green">
    {/* (Tu código de HeroSection va aquí intacto) */}
    <div className="absolute inset-0 z-0">
      <img alt="Campos agroproductivos" className="w-full h-full object-cover object-center scale-105 filter brightness-95" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdA58IdDEwFJbS7emPGD3srcn2gFmoa-8K2BPmJ_aKd4rYUhvyMYpPSLVH8UKxvWzvz6a6IqmDGJntxBfSp7rvoWaHyx7MV9SAWJoEDi-8epNt3pwMnzT7h70Tsa-6bdx3EOjRTMcRXKytPufBlpzXNvdH13t-dFU0chTwot0tFzqIAxSzPTCh9vu36EwmbMnd2KGcB_JMza4G8EdhkUbGmuteIGt_1oNu_fNPlogaHOnMvXiGwYsp" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1c2415]/95 via-[#2d3a1f]/85 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#1c2415] via-transparent to-transparent"></div>
    </div>
    
    <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-6 flex flex-col items-start text-white">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md border font-semibold text-xs uppercase tracking-wider mb-6" style={{ backgroundColor: 'rgba(255, 250, 224, 0.15)', borderColor: 'rgba(238, 229, 159, 0.4)', color: '#EEE59F' }}>
          <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 rounded-full bg-olivine"></motion.span>
          🌱 Red Agroproductiva Soberana
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
          Impulsando la <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #AAD480, #EEE59F, #FFFAE0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Producción Local
          </span>
        </h1>
        <p className="text-lg md:text-xl text-[#DFDDD1] leading-relaxed mb-8 max-w-xl font-normal">
          Conectamos directamente a los productores primarios y emprendedores de los 9 departamentos de Formosa con hogares, comercios e industrias.
        </p>
      </div>

      <div className="lg:col-span-6 flex flex-col gap-5">
        {/* Aquí tus tarjetas divididas (Opción A y B) */}
        <motion.div whileHover={{ scale: 1.02 }} className="group relative rounded-3xl backdrop-blur-xl bg-white/10 hover:bg-white/15 transition-colors border border-white/25 p-7 text-white shadow-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600/80 flex items-center justify-center shrink-0 shadow-lg"><span className="material-symbols-outlined text-[24px]">kitchen</span></div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-olivine">Para tu hogar y familia</span>
                <h3 className="text-2xl font-bold text-white tracking-tight">¿Buscas productos terminados?</h3>
              </div>
            </div>
          </div>
          <p className="text-sm text-[#DFDDD1] leading-relaxed mb-6">Mermeladas artesanales, cosmética botánica, miel pura fraccionada y canastas frescas.</p>
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-xs text-white/70">Despachos semanales</span>
            <a className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm shadow-lg" href="#vitrina" style={{ backgroundColor: '#75C97F', color: '#1e3318' }}>
              <span>Ir a la Vitrina</span><span className="material-symbols-outlined text-[18px]">arrow_downward</span>
            </a>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="group relative rounded-3xl backdrop-blur-xl transition-colors border border-white/20 p-7 text-white shadow-2xl flex flex-col justify-between" style={{ backgroundColor: 'rgba(45, 71, 34, 0.75)', borderColor: 'rgba(170, 212, 128, 0.3)' }}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-olivine text-kombu-green flex items-center justify-center shrink-0 shadow-lg"><span className="material-symbols-outlined text-[24px]">pallet</span></div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-olivine">Industrias & Gastronómicos</span>
                <h3 className="text-2xl font-bold text-white tracking-tight">¿Buscas materia prima?</h3>
              </div>
            </div>
          </div>
          <p className="text-sm text-[#DFDDD1] leading-relaxed mb-6">Conecta a granel y por lote con productores primarios del interior: bananas, harinas, maderas y semillas.</p>
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-xs text-white/70">Cotización transparente</span>
            <a className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm shadow-lg" href="#donde-nace" style={{ backgroundColor: '#FFFAE0', color: '#1e3318' }}>
              <span>Ver Mapa Provincial</span><span className="material-symbols-outlined text-[18px]">travel_explore</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);