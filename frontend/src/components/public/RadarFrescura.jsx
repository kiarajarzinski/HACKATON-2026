import React from 'react';

// Ampliamos a 4 elementos para llenar la grilla
const alertasFrescura = [
  { id: 1, prod: 'Mandioca', tiempo: 'Cosechado hace 2 hs', img: 'https://images.unsplash.com/photo-1596484552834-6a58f850d0d7?auto=format&fit=crop&w=400&q=80' },
  { id: 2, prod: 'Cebolla de Verdeo', tiempo: 'Cosechado hace 4 hs', img: 'https://images.unsplash.com/photo-1615485974052-1f4f5f54316a?auto=format&fit=crop&w=400&q=80' },
  { id: 3, prod: 'Huevos de Campo', tiempo: 'Recolectado hoy', img: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=400&q=80' },
  { id: 4, prod: 'Tomates Cherry', tiempo: 'Cosechado hace 1 hr', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80' }
];

export const RadarFrescura = () => {
  return (
    <section className="container-max" style={{ padding: '64px 20px' }} id="radar">
      <h2 className="section-title">
        <span className="material-symbols-outlined" style={{ color: 'var(--emerald)' }}>timer</span> 
        Radar de Frescura
      </h2>
      
      {/* Contenedor Grid Responsivo: 1 col (móvil), 2 cols (tablet), 4 cols (escritorio) */}
      <div className="grid-base grid-sm-2 grid-md-4">
        {alertasFrescura.map((item) => (
          <div key={item.id} className="radar-card-oferta">
            
            <div className="radar-img-wrapper-vertical">
              <div className="radar-badge-urgencia">¡Alta Demanda!</div>
              <img src={item.img} alt={item.prod} />
            </div>
            
            <div className="radar-content-vertical">
              <h4 className="radar-title-vertical">{item.prod}</h4>
              <span className="radar-time-text">
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--emerald)' }}>schedule</span>
                {item.tiempo}
              </span>
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
};