//)iene el Navbar público y el Footer

import React from 'react';
import { motion } from 'framer-motion';

export const PublicLayout = ({ children }) => {
  return (
    <div className="font-sans antialiased selection:bg-olivine/30 selection:text-kombu-green text-[#1e3318] bg-[#F0F7EA]">
      {/* NAVBAR O HEADER */}
      <header className="fixed top-5 left-0 right-0 z-50 px-4 md:px-8 max-w-7xl mx-auto pointer-events-none">
        <div 
          className="pointer-events-auto bg-white/90 backdrop-blur-xl border shadow-xl rounded-full px-5 py-3 flex items-center justify-between transition-all duration-300"
          style={{ backgroundColor: 'rgba(240, 247, 234, 0.92)', borderColor: '#EEE59F', boxShadow: '0 10px 25px -5px rgba(45, 71, 34, 0.08)' }}
        >
          <a className="flex items-center gap-3 group" href="#">
            <motion.div whileHover={{ scale: 1.05 }} className="w-10 h-10 rounded-full bg-dark-moss flex items-center justify-center text-white shadow-md" style={{ backgroundColor: '#2d4722', color: '#FFFAE0' }}>
              <span className="material-symbols-outlined text-[22px]">potted_plant</span>
            </motion.div>
            <div className="flex flex-col text-kombu-green">
              <span className="text-lg font-extrabold tracking-tight group-hover:text-dark-moss transition-colors">EcoNexo</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-palm-leaf">Formosa</span>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full border text-sm font-semibold" style={{ backgroundColor: '#FFFAE0', border: '1px solid #EEE59F', color: '#2d4722' }}>
            {['¿Dónde Nace?', 'Radar de Frescura', 'Vitrina Productiva', 'Productores'].map((item) => (
              <a key={item} className="px-4 py-1.5 rounded-full hover:bg-white hover:text-dark-moss transition-all duration-200" href={`#${item.toLowerCase().replace(/ /g, '-')}`}>
                {item}
              </a>
            ))}
          </nav>
          <motion.a whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md" href="#vitrina" style={{ backgroundColor: '#75C97F', color: '#1e3318' }}>
            <span className="material-symbols-outlined text-[18px]">explore</span>
            <span>Ingresar / Explorar</span>
          </motion.a>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL (Home, etc) */}
      <main className="w-full">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#1e3318] text-[#FFFAE0] pt-16 pb-12 border-t" style={{ borderColor: 'rgba(238, 229, 159, 0.25)' }}>
         <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-sm opacity-80">
           © 2026 EcoNexo Formosa. Red Soberana de Comercialización Agroalimentaria.
         </div>
      </footer>
    </div>
  );
};