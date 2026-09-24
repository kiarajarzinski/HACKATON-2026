import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { b2bData } from '../../assets/data';

export const MapaProductivo = () => {
  const [activeProducer, setActiveProducer] = useState(b2bData.lomitas);

  const mapNodes = [
    { id: 'lomitas', top: '38%', left: '28%', icon: '🍯', name: 'Las Lomitas', color: 'bg-olivine' },
    { id: 'laguna', top: '28%', left: '72%', icon: '🍌', name: 'Laguna Blanca', color: 'bg-emerald-500' },
    { id: 'ibarreta', top: '48%', left: '50%', icon: '🥬', name: 'Ibarreta', color: 'bg-palm-leaf' },
    { id: 'colorado', top: '66%', left: '68%', icon: '🌾', name: 'El Colorado', color: 'bg-kombu-green' }
  ];

  return (
    <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20" id="donde-nace">
      <div className="rounded-3xl shadow-2xl border border-gray-100 bg-white p-6 md:p-8 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tu código del mapa intacto... */}
        <div className="lg:col-span-7 bg-[#faf9f5] rounded-3xl p-6 relative flex flex-col justify-between min-h-[460px] border" style={{ backgroundColor: '#F0F7EA', borderColor: '#EEE59F' }}>
          {/* SVG del mapa y botones de nodos aquí */}
          <div className="relative w-full h-[320px] my-auto flex items-center justify-center">
            <svg className="w-full h-full text-stone-200 fill-current opacity-70" preserveAspectRatio="xMidYMid meet" viewBox="0 0 800 380">
              <path d="M 40,160 L 160,110 L 320,120 L 480,90 L 640,130 L 760,190 L 720,290 L 610,270 L 450,260 L 290,250 L 120,230 Z" fill="#DFDDD1" />
              <path d="M 60,165 Q 260,170 520,160 T 730,220" fill="none" opacity="0.6" stroke="#47622A" strokeDasharray="6 6" strokeWidth="3" />
              <path d="M 650,110 L 730,220 L 700,320" fill="none" opacity="0.6" stroke="#799851" strokeDasharray="6 6" strokeWidth="3" />
            </svg>
            {mapNodes.map((node) => (
              <motion.button
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                style={{ top: node.top, left: node.left }}
                onClick={() => setActiveProducer(b2bData[node.id])}
              >
                <div className="relative flex items-center justify-center">
                  {activeProducer.id === node.id && (
                    <motion.span animate={{ scale: [1, 1.5], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className={`absolute inline-flex h-10 w-10 rounded-full ${node.color}`} />
                  )}
                  <motion.div whileHover={{ scale: 1.2 }} className={`w-9 h-9 rounded-full ${node.color === 'bg-olivine' ? 'bg-dark-moss' : node.color === 'bg-emerald-500' ? 'bg-emerald-600' : node.color} text-white flex items-center justify-center shadow-lg font-bold text-sm`}>
                    {node.icon}
                  </motion.div>
                </div>
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2.5 py-0.5 rounded-full bg-white text-[11px] font-bold text-kombu-green shadow-md whitespace-nowrap">
                  {node.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Ficha Dinámica del Productor */}
        <div className="lg:col-span-5 flex flex-col justify-between p-2">
          <AnimatePresence mode='wait'>
            <motion.div 
              key={activeProducer.id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              transition={{ duration: 0.3 }}
            >
              {/* Información del productor (Imagen, Locación, Descripción, Stock) */}
              <div className="flex items-center gap-4 my-5">
                <img alt={activeProducer.name} className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-olivine/50" src={activeProducer.img} />
                <div>
                  <h3 className="text-xl font-extrabold text-kombu-green">{activeProducer.name}</h3>
                  <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[14px] text-palm-leaf">location_on</span>
                    {activeProducer.loc}
                  </p>
                </div>
              </div>
              <div className="bg-[#faf9f5] rounded-2xl p-4 mb-4 border border-stone-200/50">
                <span className="text-[11px] font-bold uppercase text-palm-leaf block mb-1">Materia Prima</span>
                <h4 className="text-base font-bold text-kombu-green leading-snug">{activeProducer.product}</h4>
                <p className="text-xs text-stone-600 mt-1">{activeProducer.desc}</p>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-gray-100">
                  <span className="text-stone-500">Volumen Mayorista:</span><span className="font-mono font-bold text-dark-moss">{activeProducer.p1}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-gray-100">
                  <span className="text-stone-500">Volumen Gastronómico:</span><span className="font-mono font-bold text-dark-moss">{activeProducer.p2}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5">
                  <span className="text-stone-500">Stock Inmediato:</span><span className="font-bold text-kombu-green">{activeProducer.stock}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex flex-col gap-2.5">
            <motion.a whileTap={{ scale: 0.95 }} className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-semibold text-sm shadow-md" style={{ backgroundColor: '#75C97F', color: '#1e3318' }}>
              <span className="material-symbols-outlined text-[18px]">chat</span><span>Contactar Productor</span>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
};