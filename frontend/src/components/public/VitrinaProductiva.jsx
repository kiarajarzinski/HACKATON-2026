import React, { useState } from 'react';

const categorias = [
  'TODOS',
  'ALIMENTOS_CONSERVAS',
  'TEXTIL_ARTESANIAS',
  'COSMETICA_NATURAL',
  'RECICLAJE_SUSTENTABILIDAD',
  'SERVICIOS_PRODUCCION'
];

const productosMock = [
  { id: 1, nombre: 'Mermelada de Mango', descripcion: 'Dulce artesanal elaborado sin conservantes por Doña Rosa.', precio: '$4.500', imagen: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=80', categoria: 'ALIMENTOS_CONSERVAS' },
  { id: 2, nombre: 'Cesta Tejida Qom', descripcion: 'Cesta multiuso elaborada a mano con hojas de palma.', precio: '$12.000', imagen: 'https://images.unsplash.com/photo-1585250485642-261ce8d0b284?auto=format&fit=crop&w=500&q=80', categoria: 'TEXTIL_ARTESANIAS' },
  { id: 3, nombre: 'Jabón de Aloe Vera', descripcion: 'Cosmética botánica nutritiva, lote de 3 unidades.', precio: '$3.200', imagen: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=500&q=80', categoria: 'COSMETICA_NATURAL' },
  { id: 4, nombre: 'Miel de Monte', descripcion: 'Miel pura de floración silvestre, frasco de 500g.', precio: '$5.500', imagen: 'https://images.unsplash.com/photo-1587049352847-81a56d773cac?auto=format&fit=crop&w=500&q=80', categoria: 'ALIMENTOS_CONSERVAS' },
  { id: 5, nombre: 'Macetas Ecológicas', descripcion: 'Macetas hechas a partir de neumáticos reciclados.', precio: '$2.800', imagen: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=500&q=80', categoria: 'RECICLAJE_SUSTENTABILIDAD' },
  { id: 6, nombre: 'Taller de Siembra', descripcion: 'Asesoría presencial para armar huertas urbanas.', precio: '$15.000', imagen: 'https://images.unsplash.com/photo-1592424005697-3868285918e9?auto=format&fit=crop&w=500&q=80', categoria: 'SERVICIOS_PRODUCCION' },
];

export const VitrinaProductiva = () => {
  const [filtroActivo, setFiltroActivo] = useState('TODOS');

  const productosFiltrados = productosMock.filter(prod => 
    filtroActivo === 'TODOS' ? true : prod.categoria === filtroActivo
  );

  return (
    <section className="container-max" style={{ padding: '64px 20px' }} id="vitrina">
      <h2 className="section-title">Vitrina Productiva</h2>
      
      {/* Botonera de Filtros */}
      <div className="filtros-container">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltroActivo(cat)}
            className={`filtro-pill ${filtroActivo === cat ? 'activo' : ''}`}
          >
            {cat.replace('_', ' & ')}
          </button>
        ))}
      </div>

      {/* Grilla Dinámica de Productos */}
      <div className="grid-base grid-sm-2 grid-md-3">
        {productosFiltrados.map((prod) => (
          <div key={prod.id} className="vitrina-card">
            <div className="vitrina-img-wrapper">
              <img src={prod.imagen} alt={prod.nombre} />
            </div>
            <div className="vitrina-content">
              <span className="vitrina-categoria">{prod.categoria.replace('_', ' ')}</span>
              <h4 className="vitrina-title">{prod.nombre}</h4>
              <p className="vitrina-desc">{prod.descripcion}</p>
              
              <div className="vitrina-footer">
                <span className="vitrina-precio">{prod.precio}</span>
                <button className="navbar-btn" style={{ padding: '6px 16px' }}>Comprar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};