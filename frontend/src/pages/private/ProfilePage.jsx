import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import { LocationModal } from '../../components/common/LocationModal';
import { MisPedidos } from '../../components/common/MisPedidos';

export const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext); // Añadimos logout para el navbar
  const navigate = useNavigate();
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

  useEffect(() => { 
    fetchProfile(); 
  }, []);

  const handlePubChange = (e) => { 
    setPubData({ ...pubData, [e.target.name]: e.target.value }); 
  };

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
    try { 
      await api.delete(`/publicaciones/${id}`); 
      fetchProfile(); 
    } catch (error) { 
      alert('Error al eliminar el producto'); 
    }
  };

  const handleEditar = (pub) => {
    setPubData({ 
      titulo: pub.titulo, 
      descripcion: pub.descripcion || '', 
      precio: pub.precio, 
      unidadMedida: pub.unidadMedida, 
      stock: pub.stock, 
      pedidoMinimo: pub.pedidoMinimo 
    });
    setEditingId(pub.id); 
    setMostrarFormulario(true); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false); 
    setEditingId(null);
    setPubData({ titulo: '', descripcion: '', precio: '', unidadMedida: 'Kg', stock: '', pedidoMinimo: '1' });
    setFotoFile(null);
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando perfil...</div>;
  if (!profileData) return <div style={{ padding: '2rem', textAlign: 'center' }}>Error cargando la información.</div>;

  const { rol, consumidor, emprendimiento, productor } = profileData;
  const misPublicaciones = rol === 'PRODUCTOR' ? productor?.publicaciones : emprendimiento?.publicaciones;
  const perfilActivo = rol === 'CONSUMIDOR' ? consumidor : rol === 'PRODUCTOR' ? productor : emprendimiento;
  
  // const dashboardRoute = rol === 'CONSUMIDOR' ? '/consumidor' : rol === 'PRODUCTOR' ? '/productor' : '/emprendimiento';

  return (
    <div className="profile-wrapper">
      <style>{`
        .profile-wrapper {
          min-height: 100vh;
          width: 100%;
          background-color: #f4f8f1;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding-top: 120px;
          display: flex;
          flex-direction: column;
        }
        
        /* ================= NAVBAR (Idéntico al Dashboard) ================= */
        .cons-navbar-header {
          position: fixed;
          top: 20px;
          left: 0;
          right: 0;
          z-index: 999;
          padding: 0 4%;
          pointer-events: none;
        }

        .cons-navbar-pill {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          pointer-events: auto;
          background-color: rgba(240, 247, 234, 0.95);
          backdrop-filter: blur(12px);
          border-radius: 50px;
          padding: 10px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 10px 30px rgba(17, 111, 34, 0.15);
          border: 1px solid rgba(117, 201, 127, 0.2);
        }

        .cons-logo {
          font-weight: 800;
          color: #1a4d2e; /* Kombu green */
          text-decoration: none;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cons-nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cons-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50px;
          background-color: #136d2e;
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 10px rgba(117, 201, 127, 0.3);
          text-decoration: none;
        }

        .cons-icon-btn.logout {
          background-color: #fce7f3;
          color: #be185d;
          box-shadow: none;
        }

        .cons-icon-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 14px rgba(117, 201, 127, 0.4);
        }

        .cons-icon-btn.logout:hover {
          background-color: #fbcfe8;
          box-shadow: 0 6px 14px rgba(190, 24, 93, 0.2);
        }

        .cons-panel-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 50px;
          background-color: #136d2e;
          color: white;
          border: none;
          cursor: pointer;
          text-decoration: none;
          font-weight: bold;
          font-size: 13px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 10px rgba(117, 201, 127, 0.3);
        }

        .cons-panel-btn:hover {
          transform: scale(1.04);
          box-shadow: 0 6px 14px rgba(117, 201, 127, 0.4);
        }

        /* ================= CONTENIDO PRINCIPAL DEL PERFIL ================= */
        .profile-main {
          width: 100%;
          padding: 0 4%;
          padding-bottom: 80px;
          margin: 0 auto;
          max-width: 1600px;
          flex: 1;
        }
      `}</style>

      {/* NAVBAR UNIFICADO */}
      <header className="cons-navbar-header">
        <div className="cons-navbar-pill">
          <a href={rol === 'CONSUMIDOR' ? "/consumidor" : rol === 'PRODUCTOR' ? "/productor" : "/emprendimiento"} className="cons-logo">
            <span className="material-symbols-outlined" style={{ color: '#136d2e', fontSize: '28px' }}>eco</span>
            EcoNexo
          </a>
          <div className="cons-nav-actions">
            <button onClick={() => navigate(-1)} className="cons-panel-btn">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
              Volver atrás
            </button>
            <button onClick={logout} className="cons-icon-btn logout" title="Cerrar Sesión">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO DEL PERFIL */}
      <main className="profile-main">
        
        {/* Contenedor principal dividido en dos columnas */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          
          {/* COLUMNA IZQUIERDA: Información del Perfil y Avatar */}
          <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e3eade', height: 'fit-content' }}>
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
          <div style={{ flex: '2', minWidth: '400px', backgroundColor: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e3eade', height: 'fit-content' }}>
            
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
                    style={{ padding: '8px 16px', backgroundColor: mostrarFormulario ? '#ba1a1a' : '#136d2e', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', boxShadow: '0 4px 10px rgba(19, 109, 46, 0.2)' }}
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
                        <h3 style={{ margin: '5px 0', color: '#136d2e', fontSize: '16px' }}>${pub.precio} <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#707a6e' }}>/ {pub.unidadMedida}</span></h3>
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
            backgroundColor: '#ffffff', 
            borderRadius: '24px', 
            padding: '2.5rem', 
            marginTop: '2rem', 
            border: '1px solid #e3eade',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
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

            {/* Grid de Características */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ backgroundColor: '#f4f8f1', padding: '16px', borderRadius: '16px', border: '1px solid #dee5d8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '14px', color: '#171d16', marginBottom: '4px' }}>
                  <span>💧</span> Riego Eficiente
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#40493f', lineHeight: '1.4' }}>
                  Goteo de precisión y cosecha de agua de lluvia.
                </p>
              </div>

              <div style={{ backgroundColor: '#f4f8f1', padding: '16px', borderRadius: '16px', border: '1px solid #dee5d8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '14px', color: '#171d16', marginBottom: '4px' }}>
                  <span>♻️</span> Abono Natural
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#40493f', lineHeight: '1.4' }}>
                  Biofertilizantes y lombricompuesto propio.
                </p>
              </div>

              <div style={{ backgroundColor: '#f4f8f1', padding: '16px', borderRadius: '16px', border: '1px solid #dee5d8' }}>
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

        {/* INYECTAR EL MÓDULO DE PEDIDOS ABAJO EN EL PERFIL */}
        <MisPedidos />

      </main>

      {/* FOOTER UNIFICADO */}
      <footer style={{ backgroundColor: '#1a4d2e', color: '#f0f7ea', padding: '64px 24px 32px', textAlign: 'center', marginTop: 'auto', borderTop: '4px solid #136d2e' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <span className="material-symbols-outlined" style={{ color: '#136d2e', fontSize: '36px' }}>eco</span>
          <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white', letterSpacing: '-0.02em' }}>EcoNexo</span>
        </div>
        <p style={{ opacity: 0.8, fontSize: '1rem', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
          Conectando la red agroecológica y emprendedora de Formosa de manera directa, segura y sin intermediarios.
        </p>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', fontSize: '0.85rem', opacity: 0.6, fontWeight: '500' }}>
          © 2026 EcoNexo. Todos los derechos reservados.
        </div>
      </footer>

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

const inputStyle = { padding: '10px 12px', borderRadius: '12px', border: '1px solid #bfcabb', boxSizing: 'border-box', backgroundColor: '#fcfdfa', fontSize: '14px', outline: 'none' };
const btnEditLocation = { padding: '6px 12px', fontSize: '12px', backgroundColor: '#c2ed96', color: '#1a4d2e', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' };