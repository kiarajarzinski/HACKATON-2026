import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { RoleSelectorModal } from './RoleSelectorModal';
import '../../styles/Register.css';

const OPCIONES_CATEGORIAS = [
  { value: 'AGRICULTURA_EXTENSIVA', label: 'Agricultura Extensiva' },
  { value: 'FRUTIHORTICOLA', label: 'Frutihortícola' },
  { value: 'GANADERIA', label: 'Ganadería' },
  { value: 'APICULTURA', label: 'Apicultura' },
  { value: 'PISCICULTURA', label: 'Piscicultura' },
  { value: 'FORESTAL', label: 'Forestal' }
];

export const RegisterForm = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [baseData, setBaseData] = useState({ email: '', password: '', rol: null });
  const [perfilData, setPerfilData] = useState({ nombre: '', apellido: '' });

  const handleRoleSelection = (selectedRole) => {
    setBaseData({ ...baseData, rol: selectedRole });
    
    if (selectedRole === 'CONSUMIDOR') setPerfilData({ nombre: '', apellido: '' });
    if (selectedRole === 'EMPRENDIMIENTO') setPerfilData({ nombreCuenta: '', nombreResponsable: '', telefono: '', rubro: 'ALIMENTOS_CONSERVAS' });
    if (selectedRole === 'PRODUCTOR') setPerfilData({ nombreCuenta: '', nombreResponsable: '', telefono: '', tipoEstablecimiento: 'CHACRA_FAMILIAR', categorias: [] });
  };

  const handleBaseChange = (e) => {
    const { name, value } = e.target;
    setBaseData({ ...baseData, [name]: value });
    
    if (name === 'rol') {
      if (value === 'CONSUMIDOR') setPerfilData({ nombre: '', apellido: '' });
      if (value === 'EMPRENDIMIENTO') setPerfilData({ nombreCuenta: '', nombreResponsable: '', telefono: '', rubro: 'ALIMENTOS_CONSERVAS' });
      if (value === 'PRODUCTOR') setPerfilData({ nombreCuenta: '', nombreResponsable: '', telefono: '', tipoEstablecimiento: 'CHACRA_FAMILIAR', categorias: [] });
    }
  };

  const handlePerfilChange = (e) => {
    setPerfilData({ ...perfilData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let nuevasCategorias = [...perfilData.categorias];
    
    if (checked) {
      nuevasCategorias.push(value);
    } else {
      nuevasCategorias = nuevasCategorias.filter(cat => cat !== value);
    }
    
    setPerfilData({ ...perfilData, categorias: nuevasCategorias });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (baseData.rol === 'PRODUCTOR' && perfilData.categorias.length === 0) {
      setError('Debes seleccionar al menos una categoría de producción.');
      setLoading(false);
      return;
    }

    try {
      await register(baseData.email, baseData.password, baseData.rol, perfilData);
      setSuccess('¡Registro exitoso! Revisa tu correo...');
      setTimeout(() => navigate('/verificar', { state: { email: baseData.email } }), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Error en el registro');
      setLoading(false);
    }
  };

  if (!baseData.rol) {
    return <RoleSelectorModal onSelectRole={handleRoleSelection} onClose={() => navigate('/')} />;
  }

  return (
    <div className="register-page-wrapper">
      <div className="register-left">
        <span className="badge-white">REGISTRO DE CUENTA OFICIAL</span>
        <h1 className="register-title">EcoNexo<br/>Chacras</h1>
        <p className="register-subtitle-sm">RED AGROALIMENTARIA PROVINCIAL</p>
        
        <div className="quote-box">
          <h3>El origen conecta.</h3>
          <p>Unimos productores, emprendimientos y consumidores para construir una red más cercana, transparente y sostenible.</p>
        </div>
        
        <div className="features-box">
          <h4>EcoNexo</h4>
          <p>Producción local · Comercio justo · Trazabilidad</p>
          <ul className="check-list">
            <li>✓ Sin comisiones especulativas ni intermediarios</li>
            <li>✓ Trazabilidad de origen y logística provincial</li>
            <li>✓ Asistencia territorial directa vía WhatsApp</li>
          </ul>
        </div>
      </div>

      <div className="register-right">
        <div className="register-form-wrapper">
          <div className="role-selector-inline">
            <span>Rol seleccionado:</span>
            <select name="rol" value={baseData.rol} onChange={handleBaseChange} className="role-select-inline">
              <option value="CONSUMIDOR">Consumidor</option>
              <option value="EMPRENDIMIENTO">Emprendimiento</option>
              <option value="PRODUCTOR">Productor</option>
            </select>
          </div>

          <h2>Crea tu cuenta en EcoNexo</h2>
          
          {error && <div className="register-alert error">{error}</div>}
          {success && <div className="register-alert success">{success}</div>}
          
          <form onSubmit={handleSubmit} className="register-form">
            
            {/* INLINE GRID: Fila 1 -> Email y Contraseña siempre juntos */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="register-input-group">
                <label>Correo Electrónico</label>
                <input type="email" name="email" className="register-input" placeholder="juan@correo.com" required onChange={handleBaseChange} />
              </div>
              <div className="register-input-group">
                <label>Contraseña</label>
                <input type="password" name="password" className="register-input" placeholder="Mín. 6 caracteres" required onChange={handleBaseChange} />
              </div>
            </div>

            {/* CASO: CONSUMIDOR */}
            {baseData.rol === 'CONSUMIDOR' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="register-input-group">
                  <label>Nombre</label>
                  <input type="text" name="nombre" className="register-input" required onChange={handlePerfilChange} />
                </div>
                <div className="register-input-group">
                  <label>Apellido</label>
                  <input type="text" name="apellido" className="register-input" required onChange={handlePerfilChange} />
                </div>
              </div>
            )}

            {/* CASO: EMPRENDIMIENTO */}
            {baseData.rol === 'EMPRENDIMIENTO' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="register-input-group">
                    <label>Nombre del Emprendimiento</label>
                    <input type="text" name="nombreCuenta" className="register-input" placeholder="Ej. Finca Monte Adentro" required onChange={handlePerfilChange} />
                  </div>
                  <div className="register-input-group">
                    <label>Rubro</label>
                    <select name="rubro" className="register-select" required onChange={handlePerfilChange}>
                      <option value="ALIMENTOS_CONSERVAS">Alimentos y Conservas</option>
                      <option value="TEXTIL_ARTESANIAS">Textil y Artesanías</option>
                      <option value="COSMETICA_NATURAL">Cosmética Natural</option>
                      <option value="RECICLAJE_SUSTENTABILIDAD">Reciclaje y Sustentabilidad</option>
                      <option value="SERVICIOS_PRODUCCION">Servicios de Producción</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="register-input-group">
                    <label>Nombre del Responsable</label>
                    <input type="text" name="nombreResponsable" className="register-input" required onChange={handlePerfilChange} />
                  </div>
                  <div className="register-input-group">
                    <label>Teléfono</label>
                    <input type="text" name="telefono" className="register-input" placeholder="Ej. 3704 123456" required onChange={handlePerfilChange} />
                  </div>
                </div>
              </>
            )}

            {/* CASO: PRODUCTOR */}
            {baseData.rol === 'PRODUCTOR' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="register-input-group">
                    <label>Nombre de tu Finca / Chacra</label>
                    <input type="text" name="nombreCuenta" className="register-input" placeholder="Ej. Finca Monte Adentro" required onChange={handlePerfilChange} />
                  </div>
                  <div className="register-input-group">
                    <label>Tipo de Establecimiento</label>
                    <select name="tipoEstablecimiento" className="register-select" required onChange={handlePerfilChange}>
                      <option value="CHACRA_FAMILIAR">Chacra Familiar</option>
                      <option value="QUINTA_HUERTA">Quinta / Huerta</option>
                      <option value="CAMPO_PARCELA">Campo / Parcela</option>
                      <option value="APIARIO_MONTE">Apiario / Monte</option>
                      <option value="FINCA_FRUTALES">Finca de Frutales</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="register-input-group">
                    <label>Nombre del Responsable</label>
                    <input type="text" name="nombreResponsable" className="register-input" required onChange={handlePerfilChange} />
                  </div>
                  <div className="register-input-group">
                    <label>Teléfono</label>
                    <input type="text" name="telefono" className="register-input" placeholder="Ej. 3704 123456" required onChange={handlePerfilChange} />
                  </div>
                </div>
                
                <div className="register-input-group" style={{ marginTop: '0.2rem' }}>
                  <label>Categorías de Producción</label>
                  <div className="checkbox-grid">
                    {OPCIONES_CATEGORIAS.map((cat) => (
                      <label key={cat.value} className="checkbox-label">
                        <input 
                          type="checkbox" 
                          value={cat.value}
                          onChange={handleCheckboxChange}
                          checked={perfilData.categorias.includes(cat.value)}
                        />
                        {cat.label}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="register-btn" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? 'Procesando...' : 'Crear mi cuenta gratuita'}
            </button>
          </form>

          <p className="register-footer">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>

        </div>
      </div>
    </div>
  );
};