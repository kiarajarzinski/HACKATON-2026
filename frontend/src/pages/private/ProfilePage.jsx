import { useEffect, useState, useContext } from 'react';
import api from '../../api/axiosConfig';
import { Navbar } from '../../components/auth/Navbar';
import { AuthContext } from '../../context/AuthContext';
import { LocationModal } from '../../components/common/LocationModal'; // <-- IMPORTAMOS EL MODAL

export const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estado para controlar el modal del mapa
  const [showLocationModal, setShowLocationModal] = useState(false);
  
  // Estados para el CRUD de publicaciones
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loadingPub, setLoadingPub] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pubData, setPubData] = useState({ titulo: '', descripcion: '', precio: '', unidadMedida: 'Kg', stock: '', pedidoMinimo: '1' });

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setProfileData(data);
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handlePubChange = (e) => { setPubData({ ...pubData, [e.target.name]: e.target.value }); };

  const handleSubmitPublicacion = async (e) => {
    e.preventDefault();
    setLoadingPub(true);
    try {
      if (editingId) await api.put(`/publicaciones/${editingId}`, pubData);
      else await api.post('/publicaciones', pubData);
      
      handleCerrarFormulario();
      fetchProfile();
    } catch (error) { alert(error.response?.data?.error || 'Error al procesar la publicación'); } 
    finally { setLoadingPub(false); }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try { await api.delete(`/publicaciones/${id}`); fetchProfile(); } 
    catch (error) { alert('Error al eliminar el producto'); }
  };

  const handleEditar = (pub) => {
    setPubData({ titulo: pub.titulo, descripcion: pub.descripcion || '', precio: pub.precio, unidadMedida: pub.unidadMedida, stock: pub.stock, pedidoMinimo: pub.pedidoMinimo });
    setEditingId(pub.id); setMostrarFormulario(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false); setEditingId(null);
    setPubData({ titulo: '', descripcion: '', precio: '', unidadMedida: 'Kg', stock: '', pedidoMinimo: '1' });
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando perfil...</div>;
  if (!profileData) return <div style={{ padding: '2rem', textAlign: 'center' }}>Error cargando la información.</div>;

  const { rol, consumidor, emprendimiento, productor } = profileData;
  const misPublicaciones = rol === 'PRODUCTOR' ? productor?.publicaciones : emprendimiento?.publicaciones;

  // Variables para enviar datos previos al mapa
  const perfilActivo = rol === 'CONSUMIDOR' ? consumidor : rol === 'PRODUCTOR' ? productor : emprendimiento;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
      <Navbar />

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* COLUMNA IZQUIERDA: Información del Perfil */}
        <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#bdc3c7', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>📷</div>
            <h2 style={{ margin: 0 }}>
              {rol === 'CONSUMIDOR' ? `${consumidor?.nombre} ${consumidor?.apellido}` : ''}
              {rol === 'EMPRENDIMIENTO' ? emprendimiento?.nombreCuenta : ''}
              {rol === 'PRODUCTOR' ? productor?.nombreCuenta : ''}
            </h2>
            <p style={{ color: '#7f8c8d', margin: '5px 0' }}>{profileData.email}</p>
            <span style={{ display: 'inline-block', padding: '4px 8px', backgroundColor: '#e8f4f8', color: '#2980b9', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{rol}</span>
          </div>

          <hr style={{ borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

          <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
            {rol === 'CONSUMIDOR' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0 }}>
                    <b>Localidad:</b> {consumidor?.localidad ? consumidor.localidad : (consumidor?.latitud ? '📍 Ubicada en mapa' : 'Falta ubicar en mapa')}
                    </p>
                <button onClick={() => setShowLocationModal(true)} style={btnEditLocation}>✏️ Editar</button>
              </div>
            )}

            {rol === 'EMPRENDIMIENTO' && (
              <>
                <p><b>Responsable:</b> {emprendimiento?.nombreResponsable}</p>
                <p><b>Teléfono:</b> {emprendimiento?.telefono}</p>
                <p><b>Rubro:</b> {emprendimiento?.rubro?.replace(/_/g, ' ')}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <p style={{ margin: 0 }}>
                    <b>Ubicación:</b> {emprendimiento?.localidad ? emprendimiento.localidad : (emprendimiento?.latitud ? '📍 Ubicada en mapa' : 'Falta ubicar en mapa')}
                    </p>
                    <button onClick={() => setShowLocationModal(true)} style={btnEditLocation}>✏️ Editar</button>
                </div>
              </>
            )}

            {rol === 'PRODUCTOR' && (
              <>
                <p><b>Responsable:</b> {productor?.nombreResponsable}</p>
                <p><b>Teléfono:</b> {productor?.telefono}</p>
                <p><b>Establecimiento:</b> {productor?.tipoEstablecimiento?.replace(/_/g, ' ')}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <p style={{ margin: 0 }}>
                       <b>Ubicación:</b> {productor?.localidad ? productor.localidad : (productor?.latitud ? '📍 Ubicada en mapa' : 'Falta ubicar en mapa')}
                    </p>
                  <button onClick={() => setShowLocationModal(true)} style={btnEditLocation}>✏️ Editar</button>
                </div>

                <div style={{ marginTop: '15px' }}>
                  <b>Categorías:</b>
                  <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    {productor?.productor_categorias?.map((pc) => (
                      <li key={pc.id}>{pc.categorias_produccion?.nombre}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Productos */}
        <div style={{ flex: '2', minWidth: '400px', backgroundColor: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          
          {rol === 'CONSUMIDOR' ? (
            <>
              <h3>Mi Actividad Reciente</h3>
              <div style={{ padding: '2rem', textAlign: 'center', color: '#95a5a6', border: '2px dashed #ecf0f1', borderRadius: '8px', marginTop: '1rem' }}>
                <p>Tus compras, favoritos y mapa de calor aparecerán aquí pronto.</p>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Mis Productos</h3>
                <button 
                  onClick={mostrarFormulario ? handleCerrarFormulario : () => setMostrarFormulario(true)}
                  style={{ padding: '8px 16px', backgroundColor: mostrarFormulario ? '#e74c3c' : '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {mostrarFormulario ? 'Cancelar' : '+ Nuevo Producto'}
                </button>
              </div>
              
              {mostrarFormulario && (
                <form onSubmit={handleSubmitPublicacion} style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #ddd' }}>
                  <h4>{editingId ? 'Editar Publicación' : 'Crear nueva publicación'}</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <input type="text" name="titulo" placeholder="Título (ej: Tomates perita)" value={pubData.titulo} onChange={handlePubChange} required style={inputStyle} />
                    <input type="number" name="precio" placeholder="Precio ($)" value={pubData.precio} onChange={handlePubChange} required style={inputStyle} step="0.01" />
                    <select name="unidadMedida" value={pubData.unidadMedida} onChange={handlePubChange} required style={inputStyle}>
                      <option value="Kg">Kilogramo (Kg)</option>
                      <option value="Unidad">Unidad</option>
                      <option value="Litro">Litro</option>
                      <option value="Docena">Docena</option>
                      <option value="Cajon">Cajón</option>
                    </select>
                    <input type="number" name="stock" placeholder="Stock disponible" value={pubData.stock} onChange={handlePubChange} required style={inputStyle} step="0.01" />
                  </div>
                  <textarea name="descripcion" placeholder="Descripción del producto..." value={pubData.descripcion} onChange={handlePubChange} style={{...inputStyle, width: '100%', height: '80px', marginBottom: '10px'}} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <label style={{ fontSize: '14px' }}>Pedido Mínimo:</label>
                    <input type="number" name="pedidoMinimo" value={pubData.pedidoMinimo} onChange={handlePubChange} style={{...inputStyle, width: '100px', margin: 0}} step="0.01" />
                  </div>
                  <button type="submit" disabled={loadingPub} style={{ padding: '10px', backgroundColor: editingId ? '#f39c12' : '#3498db', color: 'white', border: 'none', borderRadius: '6px', width: '100%', cursor: 'pointer', fontWeight: 'bold' }}>
                    {loadingPub ? 'Guardando...' : (editingId ? 'Actualizar Producto' : 'Publicar Producto')}
                  </button>
                </form>
              )}

              {!misPublicaciones || misPublicaciones.length === 0 ? (
                <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#95a5a6', border: '2px dashed #ecf0f1', borderRadius: '8px' }}>
                  <p style={{ fontSize: '24px', margin: '0 0 10px 0' }}>🛒</p>
                  <p>Aún no tienes productos registrados.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                  {misPublicaciones.map(pub => (
                    <div key={pub.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '15px', position: 'relative' }}>
                      <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: pub.activo ? '#2ecc71' : '#e74c3c', width: '12px', height: '12px', borderRadius: '50%' }} title={pub.activo ? 'Activo' : 'Pausado'} />
                      <h4 style={{ margin: '0 0 10px 0', paddingRight: '20px' }}>{pub.titulo}</h4>
                      <p style={{ margin: '5px 0', color: '#7f8c8d', fontSize: '13px', height: '40px', overflow: 'hidden' }}>{pub.descripcion || 'Sin descripción'}</p>
                      <h3 style={{ margin: '10px 0', color: '#2c3e50' }}>${pub.precio} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>/ {pub.unidadMedida}</span></h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555', backgroundColor: '#f9f9f9', padding: '8px', borderRadius: '4px', marginBottom: '10px' }}>
                        <span><b>Stock:</b> {pub.stock}</span>
                        <span><b>Mínimo:</b> {pub.pedidoMinimo}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                        <button onClick={() => handleEditar(pub)} style={{ flex: 1, padding: '5px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>✏️ Editar</button>
                        <button onClick={() => handleEliminar(pub.id)} style={{ flex: 1, padding: '5px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>🗑️ Eliminar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MODAL CONTROLADO */}
      {showLocationModal && (
        <LocationModal 
          forceOpen={true}
          initialData={{
            lat: perfilActivo?.latitud,
            lng: perfilActivo?.longitud,
            localidad: perfilActivo?.localidad,
            direccionReferencia: perfilActivo?.direccionReferencia
          }}
          onClose={() => setShowLocationModal(false)}
          onSuccess={() => { setShowLocationModal(false); fetchProfile(); }}
        />
      )}
    </div>
  );
};

const inputStyle = { padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' };
const btnEditLocation = { padding: '4px 8px', fontSize: '12px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };