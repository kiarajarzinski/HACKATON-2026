import React from 'react';

export const TrustStrip = () => (
  <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-20">
    <div className="bg-white rounded-3xl shadow-xl border p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6" style={{ borderColor: '#EEE59F' }}>
      {[
        { icon: 'agriculture', title: 'Directo de Chacra', sub: 'Sin intermediarios', color: 'text-dark-moss' },
        { icon: 'local_shipping', title: 'Logística Rural', sub: 'Corredor 81 & 11', color: 'text-palm-leaf' },
        { icon: 'balance', title: 'Comercio Justo', sub: 'Precios transparentes', color: 'text-dark-moss' },
        { icon: 'verified', title: 'Origen Formosa', sub: '100% Trazable', color: 'text-emerald-600' }
      ].map((item, idx) => (
        <div key={idx} className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-full bg-[#DFDDD1]/50 flex items-center justify-center shrink-0 ${item.color}`}>
            <span className="material-symbols-outlined text-[26px]">{item.icon}</span>
          </div>
          <div>
            <h4 className="font-bold text-sm text-kombu-green">{item.title}</h4>
            <p className="text-xs text-stone-500">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);