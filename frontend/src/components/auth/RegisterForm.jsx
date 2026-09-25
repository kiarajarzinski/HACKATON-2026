import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { RoleSelectorModal } from './RoleSelectorModal';

export const RegisterForm = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    fullname: '', 
    email: '', 
    password: '', 
    entity: '' 
  });

  if (!selectedRole) {
    return (
      <RoleSelectorModal 
        onSelectRole={setSelectedRole}
        onClose={() => navigate('/')} 
      />
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const datosPerfil = {
        nombre: formData.fullname,
        emprendimiento: formData.entity
      };
      
      await register(formData.email, formData.password, selectedRole, datosPerfil);
      const destination = selectedRole === 'productor'
        ? '/productor'
        : selectedRole === 'emprendedor' ? '/emprendedor' : '/consumidor';
      navigate(destination);
    } catch (error) {
      setError(error.message || 'Hubo un error al registrar la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="split-layout">
      {/* Mitad Narrativa (Izquierda) */}
      <div className="narrative-section">
        <div className="narrative-content">
          <span className="badge-verified">Registro de Cuenta Oficial</span>
          <h1>EcoNexo Chacras</h1>
          <p className="narrative-kicker">RED AGROALIMENTARIA PROVINCIAL</p>
          <div className="narrative-message">
            <h2>El origen conecta.</h2>
            <p>Unimos productores, emprendimientos y consumidores para construir una red más cercana, transparente y sostenible.</p>
          </div>
          <p className="narrative-author">EcoNexo<br /><span>Producción local · Comercio justo · Trazabilidad</span></p>
          <ul className="narrative-list"><li>Sin comisiones especulativas ni intermediarios</li><li>Trazabilidad de origen y logística provincial</li><li>Asistencia territorial directa vía WhatsApp</li></ul>
        </div>
      </div>

      {/* Mitad Formulario (Derecha) */}
      <div className="form-section">
        <div className="form-container">
          <div className="role-indicator">
            <span>Rol seleccionado: <strong>{selectedRole}</strong></span>
            <button type="button" onClick={() => setSelectedRole(null)} className="btn-link">(Cambiar)</button>
          </div>
          
          <h2>Crea tu cuenta en EcoNexo</h2>
          
          {error && <div className="alert-error">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Nombre Completo</label>
              <input type="text" name="fullname" required onChange={handleChange} placeholder="Ej. Juan Manuel Silva" />
            </div>

            <div className="input-group">
              <label>Correo Electrónico</label>
              <input type="email" name="email" required onChange={handleChange} placeholder="juan@correo.com" />
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <input type="password" name="password" required minLength="6" onChange={handleChange} placeholder="Mínimo 6 caracteres" />
            </div>

            {/* Condicional: No pedimos emprendimiento si es un consumidor */}
            {selectedRole !== 'consumidor' && (
              <div className="input-group">
                <label>Nombre de tu Emprendimiento / Finca</label>
                <input type="text" name="entity" required onChange={handleChange} placeholder="Ej. Finca Monte Adentro" />
              </div>
            )}

            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear mi cuenta gratuita'}
            </button>
          </form>

          <p className="form-footer">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </main>
  );
};