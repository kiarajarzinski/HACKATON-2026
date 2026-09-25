import { useEffect, useState, useContext } from 'react';
import api from '../../api/axiosConfig';
import { Navbar } from '../../components/auth/Navbar';
import { AuthContext } from '../../context/AuthContext';
import { LocationModal } from '../../components/common/LocationModal';
import { MisPedidos } from '../../components/common/MisPedidos'; // <-- 1. IMPORTAR EL MÓDULO DE PEDIDOS

export const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loadingPub, setLoadingPub] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pubData, setPubData] = useState({ titulo: '', descripcion: '', precio: '', unidadMedida: 'Kg', stock: '', pedidoMinimo: '1' });
  const [fotoFile, setFotoFile] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('foto', file);

    setUploadingAvatar(true);
    try {
      await api.put('/users/profile-picture', formData);
      fetchProfile();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al subir la foto de perfil');
    } finally {
      setUploadingAvatar(false);
    }
  };

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
    
    const formData = new FormData();
    formData.append('titulo', pubData.titulo);
    formData.append('descripcion', pubData.descripcion);
    formData.append('precio', pubData.precio);
    formData.append('unidadMedida', pubData.unidadMedida);
    formData.append('stock', pubData.stock);
    formData.append('pedidoMinimo', pubData.pedidoMinimo);
  
    if (fotoFile) {
      formData.append('foto', fotoFile);
    }

    try {
      if (editingId) {
        await api.put(`/publicaciones/${editingId}`, formData);
      } else {
        await api.post('/publicaciones', formData);
      }
      
      handleCerrarFormulario();
      fetchProfile();
    } catch (error) { 
      alert(error.response?.data?.error || 'Error al procesar la publicación'); 
    } finally { 
      setLoadingPub(false); 
    }
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
    setFotoFile(null);
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando perfil...</div>;
  if (!profileData) return <div style={{ padding: '2rem', textAlign: 'center' }}>Error cargando la información.</div>;

  const { rol, consumidor, emprendimiento, productor } = profileData;
  const misPublicaciones = rol === 'PRODUCTOR' ? productor?.publicaciones : emprendimiento?.publicaciones;
  const perfilActivo = rol === 'CONSUMIDOR' ? consumidor : rol === 'PRODUCTOR' ? productor : emprendimiento;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5fcef', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto', paddingTop: '7rem' }}>
        
        {/* Contenedor principal dividido en dos columnas (Perfil + Productos) */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          
          {/* COLUMNA IZQUIERDA: Información del Perfil y Avatar */}
          <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', height: 'fit-content' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              
              <label htmlFor="avatarUpload" style={{ cursor: rol !== 'CONSUMIDOR' ? 'pointer' : 'default', display: 'inline-block' }}>
                <div style={{ 
                  width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#bdc3c7', margin: '0 auto 10px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', overflow: 'hidden',
                  border: '4px solid #ecf0f1', position: 'relative'
                }}>
                  {uploadingAvatar ? (
                    <span style={{ fontSize: '1rem', color: 'white', fontWeight: 'bold' }}>⏳</span>
                  ) : (rol === 'PRODUCTOR' && productor?.fotoPerfil) ? (
                    <img src={productor.fotoPerfil} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (rol === 'EMPRENDIMIENTO' && emprendimiento?.fotoPerfil) ? (
                    <img src={emprendimiento.fotoPerfil} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    '📷'
                  )}
                </div>
                
                {rol !== 'CONSUMIDOR' && (
                  <div style={{ fontSize: '12px', color: '#136d2e', fontWeight: 'bold', marginBottom: '15px' }}>
                    ✏️ Cambiar foto
                  </div>
                )}
              </label>

              {rol !== 'CONSUMIDOR' && (
                <input 
                  type="file" 
                  id="avatarUpload" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleAvatarChange} 
                  disabled={uploadingAvatar} 
                />
              )}

              <h2 style={{ margin: 0, color: '#171d16' }}>
                {rol === 'CONSUMIDOR' ? `${consumidor?.nombre} ${consumidor?.apellido}` : ''}
                {rol === 'EMPRENDIMIENTO' ? emprendimiento?.nombreCuenta : ''}
                {rol === 'PRODUCTOR' ? productor?.nombreCuenta : ''}
              </h2>
              <p style={{ color: '#707a6e', margin: '5px 0', fontSize: '14px' }}>{profileData.email}</p>
              <span style={{ display: 'inline-block', padding: '4px 10px', backgroundColor: '#eff6e9', color: '#136d2e', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{rol}</span>
            </div>

            <hr style={{ borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

            <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#40493f' }}>
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
                </>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: Gestión de Mis Productos / Publicaciones */}
          <div style={{ flex: '2', minWidth: '400px', backgroundColor: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', height: 'fit-content' }}>
            
            {rol === 'CONSUMIDOR' ? (
              <>
                <h3 style={{ marginTop: 0, color: '#171d16' }}>Mi Actividad Reciente</h3>
                <div style={{ padding: '2rem', textAlign: 'center', color: '#707a6e', border: '2px dashed #e3eade', borderRadius: '16px', marginTop: '1rem' }}>
                  <p>Tus favoritos y preferencias aparecerán aquí pronto.</p>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0, color: '#171d16' }}>Mis Productos en Vitrina</h3>
                  <button 
                    onClick={mostrarFormulario ? handleCerrarFormulario : () => setMostrarFormulario(true)}
                    style={{ padding: '8px 16px', backgroundColor: mostrarFormulario ? '#ba1a1a' : '#136d2e', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                  >
                    {mostrarFormulario ? 'Cancelar' : '+ Nuevo Producto'}
                  </button>
                </div>
                
                {mostrarFormulario && (
                  <form onSubmit={handleSubmitPublicacion} style={{ backgroundColor: '#eff6e9', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid #e3eade' }}>
                    <h4 style={{ marginTop: 0, color: '#171d16' }}>{editingId ? 'Editar Publicación' : 'Crear nueva publicación'}</h4>
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
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '14px', display: 'block', marginBottom: '5px', color: '#40493f' }}>Foto del producto:</label>
                      <input type="file" accept="image/*" onChange={(e) => setFotoFile(e.target.files[0])} style={{ padding: '5px', width: '100%' }} />
                    </div>
                    <button type="submit" disabled={loadingPub} style={{ padding: '10px', backgroundColor: '#136d2e', color: 'white', border: 'none', borderRadius: '12px', width: '100%', cursor: 'pointer', fontWeight: 'bold' }}>
                      {loadingPub ? 'Guardando...' : (editingId ? 'Actualizar Producto' : 'Publicar Producto')}
                    </button>
                  </form>
                )}

                {!misPublicaciones || misPublicaciones.length === 0 ? (
                  <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#707a6e', border: '2px dashed #e3eade', borderRadius: '16px' }}>
                    <p style={{ fontSize: '24px', margin: '0 0 10px 0' }}>🛒</p>
                    <p>Aún no tienes productos registrados.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
                    {misPublicaciones.map(pub => (
                      <div key={pub.id} style={{ border: '1px solid #e3eade', borderRadius: '16px', padding: '12px', backgroundColor: '#fafcf7', position: 'relative' }}>
                        {pub.fotos && pub.fotos.length > 0 && (
                          <img src={pub.fotos[0]} alt={pub.titulo} style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '12px', marginBottom: '10px' }} />
                        )}
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', color: '#171d16' }}>{pub.titulo}</h4>
                        <h3 style={{ margin: '5px 0', color: '#136d2e', fontSize: '16px' }}>${pub.precio} <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#707a6e' }}>/ {pub.unidadMedid}</span></h3>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                          <button onClick={() => handleEditar(pub)} style={{ flex: 1, padding: '6px', backgroundColor: '#ede49f', color: '#4d4812', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Editar</button>
                          <button onClick={() => handleEliminar(pub.id)} style={{ flex: 1, padding: '6px', backgroundColor: '#ffdad6', color: '#93000a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Eliminar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

        </div>
          {/* SECCIÓN DE IDENTIDAD Y SOBERANÍA ALIMENTARIA (SOLO PARA PRODUCTORES Y EMPRENDIMIENTOS) */}
        {rol !== 'CONSUMIDOR' && (
          <div style={{ 
            backgroundColor: '#f5fcef', 
            borderRadius: '24px', 
            padding: '2.5rem', 
            marginTop: '2rem', 
            border: '1px solid #e3eade',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#136d2e', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              <span>🌱</span> IDENTIDAD & SOBERANÍA ALIMENTARIA
            </div>
            
            <h2 style={{ fontSize: '26px', color: '#171d16', marginTop: 0, marginBottom: '16px', fontWeight: '700' }}>
              Conocé quién está detrás de la cosecha
            </h2>
            
            <p style={{ color: '#40493f', fontSize: '15px', lineHeight: '1.7', marginBottom: '16px' }}>
              {rol === 'PRODUCTOR' ? (productor?.nombreCuenta || 'El productor') : (emprendimiento?.nombreCuenta || 'El emprendimiento')} trabaja junto a su familia en los suelos fértiles de Formosa. Desde hace generaciones cultivan productos agroecológicos, hortalizas de estación y elaboraciones artesanales respetando los ciclos biológicos naturales de la región subtropical.
            </p>
            
            <p style={{ color: '#40493f', fontSize: '15px', lineHeight: '1.7', marginBottom: '2rem' }}>
              Aquí no se utilizan herbicidas ni fertilizantes químicos sintéticos. Los espacios de producción se nutren de abono orgánico compuesto, mulch vegetal para retener humedad frente a las altas temperaturas, y prácticas de comercio justo sin intermediarios usureros.
            </p>

            {/* Grid de Características (3 Tarjetas inferiores) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              
              <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #dee5d8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '14px', color: '#171d16', marginBottom: '4px' }}>
                  <span>💧</span> Riego Eficiente
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#40493f', lineHeight: '1.4' }}>
                  Goteo de precisión y cosecha de agua de lluvia.
                </p>
              </div>

              <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #dee5d8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '14px', color: '#171d16', marginBottom: '4px' }}>
                  <span>♻️</span> Abono Natural
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#40493f', lineHeight: '1.4' }}>
                  Biofertilizantes y lombricompuesto propio.
                </p>
              </div>

              <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #dee5d8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '14px', color: '#171d16', marginBottom: '4px' }}>
                  <span>🌳</span> Trabajo Familiar
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#40493f', lineHeight: '1.4' }}>
                  Comercio justo directo sin intermediarios usureros.
                </p>
              </div>

            </div>
          </div>
        )}
        {/* 2. INYECTAR EL MÓDULO DE PEDIDOS ABAJO EN EL PERFIL */}
        <MisPedidos />

      </div>

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

const inputStyle = { padding: '8px 12px', borderRadius: '8px', border: '1px solid #bfcabb', boxSizing: 'border-box', backgroundColor: 'white' };
const btnEditLocation = { padding: '4px 10px', fontSize: '12px', backgroundColor: '#c2ed96', color: '#486c25', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' };