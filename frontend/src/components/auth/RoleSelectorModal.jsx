import React from 'react';

const RoleIcon = ({ role }) => {
  if (role === 'productor') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" className="role-icon-svg">
        <path d="M5 20h16l3-7h3v7h-2M8 20a3 3 0 1 0 6 0m8 0a3 3 0 1 0 6 0M8 20v-7h7l3 7M15 13V8h5l3 5" />
      </svg>
    );
  }

  if (role === 'emprendedor') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" className="role-icon-svg">
        <path d="M5 13h22v13H5zM3 13l3-6h20l3 6M12 7v6m8-6v6M11 26v-7h10v7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="role-icon-svg">
      <path d="M5 11h22l-2 16H7L5 11Zm3 0 3-5h10l3 5M12 16h8" />
    </svg>
  );
};

export const RoleSelectorModal = ({ onSelectRole, onClose }) => {
  const roles = [
    { id: 'productor', icon: 'tractor', title: 'Productor Primario', desc: 'Quiero vender materia prima' },
    { id: 'emprendedor', icon: 'storefront', title: 'Emprendedor B2B', desc: 'Quiero comprar insumos / B2B' },
    { id: 'consumidor', icon: 'shopping_basket', title: 'Consumidor Familiar', desc: 'Quiero comprar productos' }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content text-center">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <span className="badge-step">Paso 1 de 2 • Identificación Territorial</span>
        <h2 className="modal-title">¿Cómo te gustaría unirte a EcoNexo?</h2>
        <p className="modal-subtitle">Conectamos de forma directa la producción de nuestras chacras.</p>
        
        <div className="roles-grid">
          {roles.map((role) => (
            <div key={role.id} className="role-card" onClick={() => onSelectRole(role.id)}>
              <span className="role-icon-wrapper"><RoleIcon role={role.id} /></span>
              <h3>{role.title}</h3>
              <p>{role.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};