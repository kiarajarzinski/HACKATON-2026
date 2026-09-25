import React, { useState, useContext } from "react";
import { ReportarModal } from "../common/ReportarModal";
import { AuthContext } from "../../context/AuthContext";

const categorias = [
  "TODOS",
  "ALIMENTOS_CONSERVAS",
  "TEXTIL_ARTESANIAS",
  "COSMETICA_NATURAL",
  "RECICLAJE_SUSTENTABILIDAD",
  "SERVICIOS_PRODUCCION",
];

const productosMock = [
  {
    id: "prod_1",
    nombre: "Mermelada de Mango",
    descripcion: "Dulce artesanal elaborado sin conservantes por Doña Rosa.",
    precio: "4500",
    imagen:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=80",
    categoria: "ALIMENTOS_CONSERVAS",
    vendedor: "Chacra Don Pedro (Laguna Naineck)",
  },
  {
    id: "prod_2",
    nombre: "Cesta Tejida Qom",
    descripcion: "Cesta multiuso elaborada a mano con hojas de palma.",
    precio: "12000",
    imagen:
      "https://images.unsplash.com/photo-1585250485642-261ce8d0b284?auto=format&fit=crop&w=500&q=80",
    categoria: "TEXTIL_ARTESANIAS",
    vendedor: "Comunidad Qom (Formosa)",
  },
  {
    id: "prod_3",
    nombre: "Jabón de Aloe Vera",
    descripcion: "Cosmética botánica nutritiva, lote de 3 unidades.",
    precio: "3200",
    imagen:
      "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=500&q=80",
    categoria: "COSMETICA_NATURAL",
    vendedor: "EcoAromas (Pirané)",
  },
  {
    id: "prod_4",
    nombre: "Miel de Monte",
    descripcion: "Miel pura de floración silvestre, frasco de 500g.",
    precio: "5500",
    imagen:
      "https://images.unsplash.com/photo-1587049352847-81a56d773cac?auto=format&fit=crop&w=500&q=80",
    categoria: "ALIMENTOS_CONSERVAS",
    vendedor: "Cooperativa Las Lomitas",
  },
];

export const VitrinaProductiva = () => {
  const { user } = useContext(AuthContext);
  const [filtroActivo, setFiltroActivo] = useState("TODOS");

  // Estado para el modal de reportes
  const [productoAReportar, setProductoAReportar] = useState(null);
  const [showReportarModal, setShowReportarModal] = useState(false);

  const productosFiltrados = productosMock.filter((prod) =>
    filtroActivo === "TODOS" ? true : prod.categoria === filtroActivo,
  );

  const handleAbrirReporte = (prod) => {
    setProductoAReportar({
      id: prod.id,
      titulo: prod.nombre,
      precio: prod.precio,
      vendedor: prod.vendedor,
      fotos: [prod.imagen],
    });
    setShowReportarModal(true);
  };

  return (
    <section
      className="container-max"
      style={{ padding: "64px 20px" }}
      id="vitrina"
    >
      <h2 className="section-title">Vitrina Productiva</h2>

      {/* Botonera de Filtros */}
      <div className="filtros-container">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltroActivo(cat)}
            className={`filtro-pill ${filtroActivo === cat ? "activo" : ""}`}
          >
            {cat.replace("_", " & ")}
          </button>
        ))}
      </div>

      {/* Grilla Dinámica de Productos */}
      <div className="grid-base grid-sm-2 grid-md-3">
        {productosFiltrados.map((prod) => (
          <div
            key={prod.id}
            className="vitrina-card"
            style={{ position: "relative" }}
          >
            {/* BOTÓN FLOTANTE PARA REPORTAR */}
            <button
              onClick={() => handleAbrirReporte(prod)}
              title="Reportar publicación"
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                zIndex: 10,
                backgroundColor: "rgba(255,255,255,0.85)",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              🚩
            </button>

            <div className="vitrina-img-wrapper">
              <img src={prod.imagen} alt={prod.nombre} />
            </div>
            <div className="vitrina-content">
              <span className="vitrina-categoria">
                {prod.categoria.replace("_", " ")}
              </span>
              <h4 className="vitrina-title">{prod.nombre}</h4>
              <p className="vitrina-desc">{prod.descripcion}</p>

              <div className="vitrina-footer">
                <span className="vitrina-precio">${prod.precio}</span>
                <button className="navbar-btn" style={{ padding: "6px 16px" }}>
                  Comprar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE REPORTE CONECTADO */}
      <ReportarModal
        isOpen={showReportarModal}
        onClose={() => setShowReportarModal(false)}
        publicacion={productoAReportar || {}}
        userId={user?.id}
        onReporteEnviado={() =>
          alert(
            "¡Gracias! El reporte fue enviado al panel de moderación /admin.",
          )
        }
      />
    </section>
  );
};
