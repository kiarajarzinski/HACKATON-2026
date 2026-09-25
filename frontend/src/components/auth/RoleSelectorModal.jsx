import React from 'react';
import '../../styles/RoleSelector.css'; // Importamos el CSS que acabamos de crear

const RoleIcon = ({ role }) => {
  if (role === 'PRODUCTOR') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 20h16l3-7h3v7h-2M8 20a3 3 0 1 0 6 0m8 0a3 3 0 1 0 6 0M8 20v-7h7l3 7M15 13V8h5l3 5" />
      </svg>
    );
  }

  if (role === 'EMPRENDIMIENTO') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 13h22v13H5zM3 13l3-6h20l3 6M12 7v6m8-6v6M11 26v-7h10v7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M5 11h22l-2 16H7L5 11Zm3 0 3-5h10l3 5M12 16h8" />
    </svg>
  );
};

export const RoleSelectorModal = ({ onSelectRole, onClose }) => {
  // Estos IDs deben seguir en mayúsculas porque así los valida tu RegisterForm y el backend
  const roles = [
    { id: 'PRODUCTOR', title: 'Productor Primario', desc: 'Quiero vender materia prima' },
    { id: 'EMPRENDIMIENTO', title: 'Emprendedor B2B', desc: 'Quiero comprar insumos / B2B' },
    { id: 'CONSUMIDOR', title: 'Consumidor Familiar', desc: 'Quiero comprar productos' }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
          &times;
        </button>
        
        <span className="modal-badge">Paso 1 de 2 • Identificación Territorial</span>
        
        <h2 className="modal-title">¿Cómo te gustaría unirte a EcoNexo?</h2>
        <p className="modal-subtitle">Conectamos de forma directa la producción de nuestras tierras.</p>
        
        <div className="roles-grid">
          {roles.map((role) => (
            <div 
              key={role.id} 
              className="role-card" 
              onClick={() => onSelectRole(role.id)}
            >
              <div className="role-icon-wrapper">
                <RoleIcon role={role.id} />
              </div>
              <h3>{role.title}</h3>
              <p>{role.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};