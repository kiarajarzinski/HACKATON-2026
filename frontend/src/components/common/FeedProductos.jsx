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
      cantidad: parseFloat(pub.pedidoMinimo || 1)
    });
  };

  const cerrarModal = () => {
    setPedidoModal({ show: false, producto: null, cantidad: 1 });
  };

  const handleIncrement = () => {
    setPedidoModal(prev => ({ ...prev, cantidad: prev.cantidad + 1 }));
  };

  const handleDecrement = () => {
    const min = parseFloat(pedidoModal.producto.pedidoMinimo || 1);
    if (pedidoModal.cantidad > min) {
      setPedidoModal(prev => ({ ...prev, cantidad: prev.cantidad - 1 }));
    }
  };

  // Generación segura del enlace de WhatsApp
  const getWhatsAppUrl = () => {
    const pub = pedidoModal.producto;
    if (!pub) return '#';
    
    const vendedor = pub.productores || pub.emprendimientos;
    const telefono = vendedor?.telefono;
    
    if (!telefono) return '#';

    const telefonoLimpio = telefono.replace(/\D/g, '');
    const total = (pub.precio * pedidoModal.cantidad).toLocaleString('es-AR');
    
    const mensaje = `¡Hola ${vendedor.nombreCuenta}! Me interesa tu producto de la plataforma:\n\n*${pub.titulo}*\n Cantidad: ${pedidoModal.cantidad} ${pub.unidadMedida}\n Total estimado a abonar: $${total}\n\n¿Podemos coordinar la entrega y el pago?`;
    
    return `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`;
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
                    ${parseFloat(pub.precio).toLocaleString('es-AR')} <span style={{ fontSize: '14px', color: '#7f8c8d', fontWeight: 'normal' }}>/ {pub.unidadMedida}</span>
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
                      style={{ width: '100%', padding: '10px', backgroundColor: '#136d2e', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}
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

      {/* MODAL DE PEDIDO REDISEÑADO */}
      {pedidoModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 99999, overflowY: 'auto', padding: '20px' }}>
          
          <div style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '480px', padding: '28px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 'auto' }}>
            
            {/* Botón Cerrar (X) */}
            <button onClick={cerrarModal} style={{ position: 'absolute', top: '24px', right: '24px', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f0f4f8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: '#64748b' }}>
              ✕
            </button>

            {/* Cabecera del Modal */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', paddingRight: '30px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#dcf8c6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366', flexShrink: 0, fontSize: '24px' }}>
                <span className="material-symbols-outlined">chat</span>
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#171d16', fontWeight: 'bold' }}>Coordinar Pedido Directo</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#707a6e', lineHeight: '1.4' }}>Acordá pago, entrega o retiro directamente con el vendedor sin intermediarios.</p>
              </div>
            </div>

            {/* Ficha del Producto */}
            <div style={{ backgroundColor: '#f5fcef', borderRadius: '16px', padding: '16px', display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
              {pedidoModal.producto.fotos && pedidoModal.producto.fotos.length > 0 && (
                <img src={pedidoModal.producto.fotos[0]} alt="prod" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
              )}
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#171d16', fontWeight: 'bold' }}>{pedidoModal.producto.titulo}</h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#707a6e' }}>
                  {pedidoModal.producto.productores?.nombreCuenta || pedidoModal.producto.emprendimientos?.nombreCuenta} • {pedidoModal.producto.productores?.localidad || pedidoModal.producto.emprendimientos?.localidad}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#136d2e', fontWeight: 'bold', fontSize: '15px' }}>
                    ${parseFloat(pedidoModal.producto.precio).toLocaleString('es-AR')} <span style={{color: '#707a6e', fontWeight: 'normal', fontSize: '12px'}}>/ {pedidoModal.producto.unidadMedida.toLowerCase()}</span>
                  </span>
                  <span style={{ backgroundColor: '#fdf3c7', color: '#92400e', fontSize: '11px', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' }}>
                    ⓘ Mínimo: {pedidoModal.producto.pedidoMinimo} {pedidoModal.producto.unidadMedida.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Selector de Cantidad */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#171d16' }}>Cantidad a solicitar</span>
              <span style={{ fontSize: '12px', color: '#707a6e' }}>Unidad de venta: {pedidoModal.producto.unidadMedida}</span>
            </div>
            
            <div style={{ backgroundColor: '#eff6e9', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={handleDecrement} style={{ width: '38px', height: '38px', borderRadius: '50%', border: 'none', backgroundColor: 'white', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', color: '#40493f' }}>-</button>
                <span style={{ fontSize: '22px', fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{pedidoModal.cantidad}</span>
                <button onClick={handleIncrement} style={{ width: '38px', height: '38px', borderRadius: '50%', border: 'none', backgroundColor: '#75c97f', color: 'white', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>+</button>
              </div>
              <div style={{ fontSize: '12px', color: '#40493f', lineHeight: '1.4' }}>
                <strong>{pedidoModal.cantidad} {pedidoModal.producto.unidadMedida}s</strong> • Total: {pedidoModal.cantidad} {pedidoModal.producto.unidadMedida}<br/>
                <span style={{ color: '#707a6e' }}>Producto directo de productor local</span>
              </div>
            </div>

            {/* Mensaje de validación verde */}
            <div style={{ backgroundColor: '#dcf8c6', color: '#136d2e', padding: '8px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
              Cumple con el mínimo de compra ({pedidoModal.producto.pedidoMinimo} {pedidoModal.producto.unidadMedida})
            </div>

            {/* Resumen de Totales */}
            <div style={{ backgroundColor: '#f5fcef', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#707a6e' }}>
                <span>Subtotal ({pedidoModal.cantidad} x ${parseFloat(pedidoModal.producto.precio).toLocaleString('es-AR')}):</span>
                <span style={{ fontWeight: 'bold', color: '#171d16' }}>${(pedidoModal.producto.precio * pedidoModal.cantidad).toLocaleString('es-AR')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#171d16' }}>Total Estimado a Abonar:</span>
                <span style={{ fontSize: '22px', fontWeight: '900', color: '#136d2e' }}>${(pedidoModal.producto.precio * pedidoModal.cantidad).toLocaleString('es-AR')} ARS</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#707a6e', lineHeight: '1.4', alignItems: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#136d2e', flexShrink: 0 }}>verified_user</span>
                <span>El pago se realiza directamente al productor por transferencia bancaria (Alias/CBU) o efectivo contra entrega.</span>
              </div>
            </div>

            {/* Botones de acción (Usando etiqueta <a> para evitar bloqueo de popup en navegadores) */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <button onClick={cerrarModal} style={{ padding: '14px 24px', backgroundColor: '#eff6e9', color: '#171d16', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                Cancelar
              </button>
              
              <a 
                href={getWhatsAppUrl()} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={cerrarModal}
                style={{ flex: 1, padding: '14px', backgroundColor: '#25D366', color: 'white', textDecoration: 'none', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chat</span>
                Confirmar y Abrir WhatsApp
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
              </a>
            </div>

            {/* Footer lock */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center', color: '#707a6e', fontSize: '11px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock</span>
              Se registrará tu pedido en EcoMatch y abrirá WhatsApp con el mensaje prearmado.
            </div>

          </div>
        </div>
      )}
    </div>
  );
};