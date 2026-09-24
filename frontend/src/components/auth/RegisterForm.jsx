import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const RegisterForm = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Nuevo estado de éxito
  
  const [baseData, setBaseData] = useState({ email: '', password: '', rol: 'CONSUMIDOR' });
  const [perfilData, setPerfilData] = useState({ nombre: '', apellido: '' });

  const handleBaseChange = (e) => {
    const { name, value } = e.target;
    setBaseData({ ...baseData, [name]: value });
    
    if (name === 'rol') {
      if (value === 'CONSUMIDOR') setPerfilData({ nombre: '', apellido: '' });
      if (value === 'EMPRENDIMIENTO') setPerfilData({ nombreCuenta: '', nombreResponsable: '', telefono: '', rubro: 'ALIMENTOS_CONSERVAS' });
      if (value === 'PRODUCTOR') setPerfilData({ nombreCuenta: '', nombreResponsable: '', telefono: '', tipoEstablecimiento: 'CHACRA_FAMILIAR' });
    }
  };

  const handlePerfilChange = (e) => {
    setPerfilData({ ...perfilData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await register(baseData.email, baseData.password, baseData.rol, perfilData);
      
      // Mostramos el mensaje
      setSuccess('¡Registro exitoso! Redirigiendo...');
      
      // Retrasamos la redirección 1.5 segundos
      setTimeout(() => {
        if (res.rol === 'CONSUMIDOR') navigate('/consumidor');
        if (res.rol === 'EMPRENDIMIENTO') navigate('/emprendedor');
        if (res.rol === 'PRODUCTOR') navigate('/productor');
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.error || 'Error en el registro');
    }
  };

  return (
    <div className="register-container">
      <h2>Crear Cuenta</h2>
      
      {/* Alertas visuales */}
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {success && <div style={{ color: 'green', fontWeight: 'bold', marginBottom: '10px' }}>{success}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* --- DATOS BASE DEL USUARIO --- */}
        <fieldset>
          <legend>Datos de la Cuenta</legend>
          <div>
            <label>Email:</label>
            <input type="email" name="email" required onChange={handleBaseChange} />
          </div>
          <div>
            <label>Contraseña:</label>
            <input type="password" name="password" required onChange={handleBaseChange} />
          </div>
          <div>
            <label>Tipo de Cuenta:</label>
            <select name="rol" value={baseData.rol} onChange={handleBaseChange}>
              <option value="CONSUMIDOR">Consumidor</option>
              <option value="EMPRENDIMIENTO">Emprendimiento</option>
              <option value="PRODUCTOR">Productor</option>
            </select>
          </div>
        </fieldset>

        {/* --- DATOS DINÁMICOS DEL PERFIL --- */}
        <fieldset>
          <legend>Datos del Perfil</legend>
          
          {baseData.rol === 'CONSUMIDOR' && (
            <>
              <div><label>Nombre:</label><input type="text" name="nombre" required onChange={handlePerfilChange} /></div>
              <div><label>Apellido:</label><input type="text" name="apellido" required onChange={handlePerfilChange} /></div>
            </>
          )}

          {(baseData.rol === 'EMPRENDIMIENTO' || baseData.rol === 'PRODUCTOR') && (
            <>
              <div><label>Nombre de la Cuenta:</label><input type="text" name="nombreCuenta" required onChange={handlePerfilChange} /></div>
              <div><label>Nombre del Responsable:</label><input type="text" name="nombreResponsable" required onChange={handlePerfilChange} /></div>
              <div><label>Teléfono:</label><input type="text" name="telefono" required onChange={handlePerfilChange} /></div>
            </>
          )}

          {baseData.rol === 'EMPRENDIMIENTO' && (
            <div>
              <label>Rubro:</label>
              <select name="rubro" required onChange={handlePerfilChange}>
                <option value="ALIMENTOS_CONSERVAS">Alimentos y Conservas</option>
                <option value="TEXTIL_ARTESANIAS">Textil y Artesanías</option>
                <option value="COSMETICA_NATURAL">Cosmética Natural</option>
                <option value="RECICLAJE_SUSTENTABILIDAD">Reciclaje y Sustentabilidad</option>
                <option value="SERVICIOS_PRODUCCION">Servicios de Producción</option>
              </select>
            </div>
          )}

          {baseData.rol === 'PRODUCTOR' && (
            <div>
              <label>Tipo de Establecimiento:</label>
              <select name="tipoEstablecimiento" required onChange={handlePerfilChange}>
                <option value="CHACRA_FAMILIAR">Chacra Familiar</option>
                <option value="QUINTA_HUERTA">Quinta / Huerta</option>
                <option value="CAMPO_PARCELA">Campo / Parcela</option>
                <option value="APIARIO_MONTE">Apiario / Monte</option>
                <option value="FINCA_FRUTALES">Finca de Frutales</option>
              </select>
            </div>
          )}
        </fieldset>

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};