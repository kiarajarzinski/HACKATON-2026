import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

export const FeedProductos = ({ titulo }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const { data } = await api.get('/publicaciones/feed');
        setProductos(data);
      } catch (error) {
        console.error('Error cargando el feed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando mercado...</div>;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        {titulo}
      </h2>
      
      {productos.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', border: '1px dashed #ccc' }}>
          <p style={{ fontSize: '24px', margin: '0 0 10px 0' }}>🌱</p>
          <p style={{ color: '#7f8c8d' }}>Aún no hay productos disponibles en esta sección.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {productos.map((pub) => {
            const vendedor = pub.productores || pub.emprendimientos;
            
            return (
              <div key={pub.id} style={{ backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderBottom: '1px solid #eee' }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#2c3e50' }}>{pub.titulo}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#7f8c8d' }}>
                    Vendedor: <b>{vendedor?.nombreCuenta}</b> 📍 {vendedor?.localidad || 'Ubicación no definida'}
                  </p>
                </div>
                {pub.fotos && pub.fotos.length > 0 && (
                  <img 
                    src={pub.fotos[0]} 
                    alt={pub.titulo} 
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
                  />
                )}
                <div style={{ padding: '15px', flexGrow: 1 }}>
                  <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#555', height: '40px', overflow: 'hidden' }}>
                    {pub.descripcion || 'Sin descripción detallada.'}
                  </p>
                  <h2 style={{ margin: '0 0 10px 0', color: '#27ae60' }}>
                    ${pub.precio} <span style={{ fontSize: '14px', color: '#7f8c8d', fontWeight: 'normal' }}>/ {pub.unidadMedida}</span>
                  </h2>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', backgroundColor: '#f4f6f7', padding: '8px', borderRadius: '6px' }}>
                    <span><b>Stock:</b> {pub.stock}</span>
                    <span><b>Mínimo:</b> {pub.pedidoMinimo} {pub.unidadMedida}</span>
                  </div>
                </div>

                <div style={{ padding: '15px', paddingTop: '0' }}>
                  <button style={{ width: '100%', padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Agregar al Pedido
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};