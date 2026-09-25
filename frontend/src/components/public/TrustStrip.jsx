import React from 'react';
import '../../styles/TrustStrip.css';

export const TrustStrip = () => {
  const items = [
    { icon: 'agriculture', title: 'Directo de Chacra', sub: 'Sin intermediarios' },
    { icon: 'local_shipping', title: 'Logística Rural', sub: 'Corredor 81 & 11' },
    { icon: 'balance', title: 'Comercio Justo', sub: 'Precios transparentes' },
    { icon: 'verified', title: 'Origen Formosa', sub: '100% Trazable' }
  ];

  return (
    <div className="container-max trust-strip-wrapper">
      <div className="trust-strip-card grid-base grid-sm-2 grid-md-4">
        {items.map((item, idx) => (
          <div key={idx} className="trust-item">
            <div className="trust-icon-box">
              <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>{item.icon}</span>
            </div>
            <div>
              <h4 className="trust-title">{item.title}</h4>
              <p className="trust-sub">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};