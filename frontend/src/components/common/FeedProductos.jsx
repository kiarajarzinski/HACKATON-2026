import { useState, useEffect, useContext } from 'react';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';

export const FeedProductos = ({ titulo }) => {
  const { user } = useContext(AuthContext);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para el Modal de Pedidos
  const [pedidoModal, setPedidoModal] = useState({ show: false, producto: null, cantidad: 1 });

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

  const abrirModal = (pub) => {
    setPedidoModal({
      show: true,
      producto: pub,
      cantidad: pub.pedidoMinimo || 1 // Inicia con el pedido mínimo exigido
    });
  };

  const cerrarModal = () => {
    setPedidoModal({ show: false, producto: null, cantidad: 1 });
  };

  const handleWhatsApp = () => {
    const pub = pedidoModal.producto;
    const vendedor = pub.productores || pub.emprendimientos;
    const telefono = vendedor?.telefono;
    
    if (!telefono) {
      alert("El vendedor no tiene un teléfono registrado.");
      return;
    }

    // Limpiamos el número de símbolos (ej: +54 9 11... -> 54911...)
    const telefonoLimpio = telefono.replace(/\D/g, '');
    const total = (pub.precio * pedidoModal.cantidad).toFixed(2);
    
    // Armamos un lindo mensaje predeterminado
    const mensaje = `¡Hola ${vendedor.nombreCuenta}!  Me interesa tu producto de la plataforma:\n\n*${pub.titulo}*\n Cantidad: ${pedidoModal.cantidad} ${pub.unidadMedida}\n Total estimado a abonar: $${total}\n\n¿Podemos coordinar la entrega y el pago?`;
    
    const url = `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    cerrarModal();
  };

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

                {/* Botón condicional */}
                {user?.rol !== 'PRODUCTOR' && (
                  <div style={{ padding: '15px', paddingTop: '0' }}>
                    <button 
                      onClick={() => abrirModal(pub)}
                      style={{ width: '100%', padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}
                    >
                      Agregar al Pedido
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE PEDIDO */}
      {pedidoModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            
            <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '22px' }}>Solicitar Pedido</h3>
            <p style={{ margin: '0 0 20px 0', color: '#7f8c8d', fontSize: '14px' }}>
              Estás por contactar a <b>{pedidoModal.producto.productores?.nombreCuenta || pedidoModal.producto.emprendimientos?.nombreCuenta}</b>
            </p>

            {/* Ficha rápida del producto */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '8px' }}>
              {pedidoModal.producto.fotos && pedidoModal.producto.fotos.length > 0 && (
                <img src={pedidoModal.producto.fotos[0]} alt="prod" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
              )}
              <div>
                <strong style={{ display: 'block' }}>{pedidoModal.producto.titulo}</strong>
                <span style={{ color: '#27ae60', fontWeight: 'bold' }}>${pedidoModal.producto.precio} / {pedidoModal.producto.unidadMedida}</span>
              </div>
            </div>

            {/* Input de cantidad */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#34495e' }}>Cantidad a solicitar:</label>
              <input 
                type="number" 
                min={pedidoModal.producto.pedidoMinimo || 1} 
                max={pedidoModal.producto.stock}
                value={pedidoModal.cantidad}
                onChange={(e) => setPedidoModal({...pedidoModal, cantidad: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '16px', boxSizing: 'border-box' }}
              />
              <small style={{ color: '#e74c3c', marginTop: '5px', display: 'block' }}>
                * Pedido mínimo exigido: {pedidoModal.producto.pedidoMinimo} {pedidoModal.producto.unidadMedida}
              </small>
            </div>

            {/* Resumen de Totales */}
            <div style={{ backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#64748b' }}>
                <span>Subtotal ({pedidoModal.cantidad} {pedidoModal.producto.unidadMedida}):</span>
                <span>${(pedidoModal.producto.precio * (pedidoModal.cantidad || 0)).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#64748b' }}>
                <span>Valor estimado extra:</span>
                <span>$0.00</span>
              </div>
              <hr style={{ borderTop: '1px solid #cbd5e1', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', color: '#0f172a', fontSize: '18px' }}>
                <span>Total valor estimado a Abonar:</span>
                <span style={{ color: '#27ae60' }}>${(pedidoModal.producto.precio * (pedidoModal.cantidad || 0)).toFixed(2)}</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={cerrarModal} 
                style={{ flex: 1, padding: '12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cancelar
              </button>
              <button 
                onClick={handleWhatsApp} 
                style={{ flex: 1, padding: '12px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                Concretar por wsp
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};