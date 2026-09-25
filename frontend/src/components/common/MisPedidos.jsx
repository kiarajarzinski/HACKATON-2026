import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export const MisPedidos = () => {
  const { user } = useContext(AuthContext);
  
  // Si el usuario es CONSUMIDOR, por defecto arranca en 'realizados'. Si es EMPRENDIMIENTO/PRODUCTOR, en 'recibidos'.
  const esConsumidor = user?.rol === 'CONSUMIDOR';
  const [activeTab, setActiveTab] = useState(esConsumidor ? 'realizados' : 'recibidos'); 
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'completed'

  // Datos hardcodeados profesionales basados en tu diseño maquetado
  const pedidos = [
    {
      id: 'ORD-1042',
      tipo: 'recibido', // Pedido que LE HICIERON al emprendedor/productor
      cliente: 'Lucía Benítez (Consumidor)',
      producto: 'Mermelada Artesanal de Mango Criollo (450g)',
      cantidad: '3 Frascos (1.35 kg)',
      total: '$9.600',
      estado: 'PENDIENTE',
      fecha: 'Hoy, 11:15 hs',
      imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEl2glVpnMRnUcQqaKElsLNiterMswHdF_6AkvyQua_RnUCV8pSs1gy_1GX2qTxh8KhSrApHDuQFpCwihey27P8BhW-GVKOntgFJrRv7saA_e32Y_I0qFdwFUbQQb1EHA-OM6PBfhylR4iikS8hxkLaashdMzALIcdc3dvdGJQaXkY8CLmzi0YdpMBSGHIzNvl7J5g4VqObL_8oNzOg_rWbNcqpITPTsszKCfDiZ8ntp4n7LAiIhIc',
      whatsapp: 'https://wa.me/543704000001?text=Hola%20Lucia,%20te%20escribo%20por%20tu%20pedido%20de%20mermeladas'
    },
    {
      id: 'ORD-1039',
      tipo: 'recibido',
      cliente: 'Marcos Giménez (Verdulería El Ajo)',
      producto: 'Cajón de Banana Primicia Seleccionada (20 kg)',
      cantidad: '5 Cajones (100 kg)',
      total: '$42.500',
      estado: 'CONCRETADO',
      fecha: 'Ayer, 16:40 hs',
      imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsNH42KSyPLCjw-WHWTRE0OHyE8w-k-dzh7WHZFoi4DQGDIWraQ6NpnBMpAAgRybYx01cQo4i8YjWfIIRysDJhj8FGcFFnZaEQWYjUs-zLoS1u2sbLFwwqeCGzxNlfWlUNjGQ8yEBqcVi1cVs7Mkf09rguUWcZwLXq7lvByIHpwUPr_yakqiOQcFYRwEes6yENvQ_goW7GUdPWcQHDURqbXGrJ9IWDgWu2OOTb-PsOmjvcuZRUMZPa',
      whatsapp: 'https://wa.me/543704000002?text=Hola%20Marcos,%20coordinamos%20la%20entrega%20de%20los%20cajones'
    },
    {
      id: 'ORD-1015',
      tipo: 'realizado', // Pedido que HIZO el consumidor o emprendedor
      vendedor: 'Sabores del Monte (Clorinda)',
      producto: 'Queso Criollo Semiduro Estacionado (700g)',
      cantidad: '2 Piezas (1.4 kg)',
      total: '$9.600',
      estado: 'CONCRETADO',
      fecha: '22 Sep 2026, 18:05 hs',
      imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5YwjVjapO8YyEC0B_IjLex7J1-3NQNbygXk6pbwAH0ue4FyzSBH4FUjJ2ZhCvx-0c7UWy-_5fAL_pv_IrsvoVmLP5dPoejPHwDnHf53RVHtmMj3C3Ws2ur1d02FG3SdcoA0XRWfiPks66Ua9UZeLf_ki5vcV7kq5wrv7IPgxMItYEmFUiWdOACkHORPUzhlA-gmxCL-He4vCetZQqa3NHTOdDvwb6pJKfGwQH57NSADZEofPSjT7r',
      whatsapp: 'https://wa.me/543704000004?text=Hola,%20gracias%20por%20el%20queso%20riquisimo'
    }
  ];

  // Filtrado de pedidos según rol, pestaña y estado
  const filteredPedidos = pedidos.filter(p => {
    const matchTab = esConsumidor ? p.tipo === 'realizado' : (activeTab === 'recibidos' ? p.tipo === 'recibido' : p.tipo === 'realizado');
    const matchStatus = statusFilter === 'all' || p.estado.toLowerCase() === statusFilter;
    return matchTab && matchStatus;
  });

  return (
    <div style={{ marginTop: '2.5rem', backgroundColor: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Cabecera de la Sección */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
        <div>
          <span style={{ backgroundColor: '#c2ed96', color: '#486c25', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Canal Directo WhatsApp
          </span>
          <h2 style={{ margin: '8px 0 4px 0', fontSize: '24px', color: '#171d16' }}>
            {esConsumidor ? 'Mis Compras Realizadas' : 'Gestión de Pedidos y Acuerdos'}
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#40493f' }}>
            {esConsumidor ? 'Seguimiento de las compras que coordinaste por WhatsApp.' : 'Controla los pedidos que te hicieron tus clientes y el seguimiento de tus propias compras.'}
          </p>
        </div>

        {/* Pestañas Principales: Ocultas si es CONSUMIDOR, visibles si es EMPRENDIMIENTO/PRODUCTOR */}
        {!esConsumidor && (
          <div style={{ display: 'flex', backgroundColor: '#eff6e9', padding: '4px', borderRadius: '30px' }}>
            <button 
              onClick={() => setActiveTab('recibidos')}
              style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: activeTab === 'recibidos' ? 'white' : 'transparent', color: activeTab === 'recibidos' ? '#136d2e' : '#40493f', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', boxShadow: activeTab === 'recibidos' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
              📥 Pedidos Recibidos
            </button>
            <button 
              onClick={() => setActiveTab('realizados')}
              style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: activeTab === 'realizados' ? 'white' : 'transparent', color: activeTab === 'realizados' ? '#136d2e' : '#40493f', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', boxShadow: activeTab === 'realizados' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
              🛒 Mis Compras Realizadas
            </button>
          </div>
        )}
      </div>

      {/* Sub-filtros por Estado */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setStatusFilter('all')}
          style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', backgroundColor: statusFilter === 'all' ? '#136d2e' : '#f5fcef', color: statusFilter === 'all' ? 'white' : '#40493f', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
          Todos
        </button>
        <button 
          onClick={() => setStatusFilter('pendiente')}
          style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', backgroundColor: statusFilter === 'pendiente' ? '#136d2e' : '#f5fcef', color: statusFilter === 'pendiente' ? 'white' : '#40493f', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
          Pendientes
        </button>
        <button 
          onClick={() => setStatusFilter('concretado')}
          style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', backgroundColor: statusFilter === 'concretado' ? '#136d2e' : '#f5fcef', color: statusFilter === 'concretado' ? 'white' : '#40493f', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
          Concretados
        </button>
      </div>

      {/* Listado de Pedidos */}
      {filteredPedidos.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '16px', border: '2px dashed #e3eade' }}>
          <p style={{ fontSize: '32px', margin: '0 0 10px 0' }}>📦</p>
          <p style={{ color: '#40493f', fontWeight: 'bold', margin: 0 }}>No hay pedidos en esta sección por el momento.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredPedidos.map(pedido => (
            <div key={pedido.id} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', border: '1px solid #e3eade', backgroundColor: '#fafcf7', gap: '1rem' }}>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: '1', minWidth: '280px' }}>
                <img src={pedido.imagen} alt="prod" style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', backgroundColor: pedido.estado === 'PENDIENTE' ? '#fdf3c7' : '#dcf8c6', color: pedido.estado === 'PENDIENTE' ? '#92400e' : '#136d2e', padding: '2px 8px', borderRadius: '10px' }}>
                      {pedido.estado}
                    </span>
                    <span style={{ fontSize: '12px', color: '#707a6e' }}>{pedido.fecha}</span>
                  </div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#171d16' }}>{pedido.producto}</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#40493f' }}>
                    🏪 Vendedor: <strong>{pedido.vendedor}</strong> • <strong>{pedido.cantidad}</strong>
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between', width: '100%', smWidth: 'auto' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '12px', color: '#707a6e', display: 'block' }}>Importe Total</span>
                  <span style={{ fontSize: '18px', fontWeight: '900', color: '#136d2e' }}>{pedido.total}</span>
                </div>
                
                <a 
                  href={pedido.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#25D366', color: 'white', padding: '10px 16px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', boxShadow: '0 2px 5px rgba(37,211,102,0.3)' }}
                >
                  💬 Chat WhatsApp
                </a>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};