import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig.js';
import { Navbar } from '../../components/auth/Navbar';

export const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchProfile();
  }, []);

  if (loading) return <div>Cargando perfil...</div>;
  if (!profileData) return <div>Error cargando la información.</div>;

  const { rol, consumidor, emprendimiento, productor } = profileData;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
      <Navbar />

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* COLUMNA IZQUIERDA: Información del Perfil */}
        <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            {/* Círculo placeholder para la foto */}
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#bdc3c7', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
              📷
            </div>
            <h2 style={{ margin: 0 }}>
              {rol === 'CONSUMIDOR' ? `${consumidor?.nombre} ${consumidor?.apellido}` : ''}
              {rol === 'EMPRENDIMIENTO' ? emprendimiento?.nombreCuenta : ''}
              {rol === 'PRODUCTOR' ? productor?.nombreCuenta : ''}
            </h2>
            <p style={{ color: '#7f8c8d', margin: '5px 0' }}>{profileData.email}</p>
            <span style={{ display: 'inline-block', padding: '4px 8px', backgroundColor: '#e8f4f8', color: '#2980b9', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
              {rol}
            </span>
          </div>

          <hr style={{ borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

          {/* Detalles específicos por rol */}
          <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
            {rol === 'CONSUMIDOR' && (
              <>
                <p><b>Localidad:</b> {consumidor?.localidad || 'No especificada'}</p>
              </>
            )}

            {rol === 'EMPRENDIMIENTO' && (
              <>
                <p><b>Responsable:</b> {emprendimiento?.nombreResponsable}</p>
                <p><b>Teléfono:</b> {emprendimiento?.telefono}</p>
                <p><b>Rubro:</b> {emprendimiento?.rubro}</p>
                <p><b>Ubicación:</b> {emprendimiento?.localidad || 'Falta ubicar en mapa'}</p>
              </>
            )}

            {rol === 'PRODUCTOR' && (
              <>
                <p><b>Responsable:</b> {productor?.nombreResponsable}</p>
                <p><b>Teléfono:</b> {productor?.telefono}</p>
                <p><b>Establecimiento:</b> {productor?.tipoEstablecimiento.replace('_', ' ')}</p>
                <p><b>Ubicación:</b> {productor?.localidad || 'Falta ubicar en mapa'}</p>
                <div style={{ marginTop: '10px' }}>
                  <b>Categorías:</b>
                  <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    {productor?.productor_categorias?.map((pc) => (
                      <li key={pc.id}>{pc.categorias_produccion.nombre}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Espacio para Productos / Actividades */}
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
                <button style={{ padding: '8px 16px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  + Nuevo Producto
                </button>
              </div>
              
              {/* Contenedor placeholder para el CRUD */}
              <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#95a5a6', border: '2px dashed #ecf0f1', borderRadius: '8px' }}>
                <p style={{ fontSize: '24px', margin: '0 0 10px 0' }}>🛒</p>
                <p>Aún no tienes productos registrados.</p>
                <p style={{ fontSize: '13px' }}>Aquí integraremos el CRUD para crear, actualizar y eliminar tu stock.</p>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};