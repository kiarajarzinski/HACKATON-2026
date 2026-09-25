import { useEffect, useState, useContext } from "react";
import api from "../../api/axiosConfig";
import { Navbar } from "../../components/auth/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { LocationModal } from "../../components/common/LocationModal";
import { EditarPerfilModal } from "../../components/common/EditarPerfilModal";
import { PublicarProductoModal } from "../../components/common/PublicarProductoModal";

export const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modales
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showEditarPerfilModal, setShowEditarPerfilModal] = useState(false);
  const [showPublicarModal, setShowPublicarModal] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/users/profile");
      setProfileData(data);
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await api.delete(`/publicaciones/${id}`);
      fetchProfile();
    } catch (error) {
      alert("Error al eliminar el producto");
    }
  };

  if (loading)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Cargando perfil...
      </div>
    );
  if (!profileData)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Error cargando la información.
      </div>
    );

  const { rol, consumidor, emprendimiento, productor } = profileData;
  const misPublicaciones =
    rol === "PRODUCTOR"
      ? productor?.publicaciones
      : emprendimiento?.publicaciones;
  const perfilActivo =
    rol === "CONSUMIDOR"
      ? consumidor
      : rol === "PRODUCTOR"
        ? productor
        : emprendimiento;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6fa" }}>
      <Navbar />

      <div
        style={{
          padding: "2rem",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        {/* COLUMNA IZQUIERDA: Información del Perfil (La Cara Humana) */}
        <div
          style={{
            flex: "1",
            minWidth: "300px",
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "16px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            height: "fit-content",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                backgroundColor: "#bdc3c7",
                margin: "0 auto 1rem",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {perfilActivo?.fotoPerfil ? (
                <img
                  src={perfilActivo.fotoPerfil}
                  alt="Perfil"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectCover: "cover",
                  }}
                />
              ) : (
                <span style={{ fontSize: "2.5rem" }}>
                  {rol === "PRODUCTOR" ? "🚜" : "🍯"}
                </span>
              )}
            </div>

            <h2 style={{ margin: 0 }}>
              {rol === "CONSUMIDOR"
                ? `${consumidor?.nombre} ${consumidor?.apellido}`
                : ""}
              {rol === "EMPRENDIMIENTO" ? emprendimiento?.nombreCuenta : ""}
              {rol === "PRODUCTOR" ? productor?.nombreCuenta : ""}
            </h2>
            <p style={{ color: "#7f8c8d", margin: "5px 0" }}>
              {profileData.email}
            </p>
            <span
              style={{
                display: "inline-block",
                padding: "4px 10px",
                backgroundColor: "#e8f4f8",
                color: "#16a34a",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {rol}
            </span>

            {/* BOTÓN EDITAR PERFIL & VITRINA (Solo para Productor y Emprendedor) */}
            {rol !== "CONSUMIDOR" && (
              <button
                onClick={() => setShowEditarPerfilModal(true)}
                style={{
                  marginTop: "15px",
                  width: "100%",
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #16a34a",
                  backgroundColor: "#f0fdf4",
                  color: "#16a34a",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                ✏️ Editar Identidad & Vitrina
              </button>
            )}
          </div>

          <hr style={{ borderTop: "1px solid #eee", margin: "1.5rem 0" }} />

          {/* HISTORIA HUMANA */}
          {perfilActivo?.historia && (
            <div style={{ marginBottom: "1.5rem" }}>
              <b style={{ fontSize: "13px", color: "#333" }}>
                Nuestra Historia:
              </b>
              <p
                style={{
                  fontSize: "13px",
                  color: "#666",
                  fontStyle: "italic",
                  margin: "5px 0",
                }}
              >
                "{perfilActivo.historia}"
              </p>
            </div>
          )}

          <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
            {rol === "CONSUMIDOR" && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p style={{ margin: 0 }}>
                  <b>Localidad:</b>{" "}
                  {consumidor?.localidad
                    ? consumidor.localidad
                    : consumidor?.latitud
                      ? "📍 Ubicada en mapa"
                      : "Falta ubicar en mapa"}
                </p>
                <button
                  onClick={() => setShowLocationModal(true)}
                  style={btnEditLocation}
                >
                  ✏️ Ubicación
                </button>
              </div>
            )}

            {rol === "EMPRENDIMIENTO" && (
              <>
                <p>
                  <b>Responsable:</b> {emprendimiento?.nombreResponsable}
                </p>
                <p>
                  <b>Teléfono:</b> {emprendimiento?.telefono}
                </p>
                <p>
                  <b>Rubro:</b> {emprendimiento?.rubro?.replace(/_/g, " ")}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <p style={{ margin: 0 }}>
                    <b>Ubicación:</b>{" "}
                    {emprendimiento?.localidad
                      ? emprendimiento.localidad
                      : emprendimiento?.latitud
                        ? "📍 Ubicada en mapa"
                        : "Falta ubicar en mapa"}
                  </p>
                  <button
                    onClick={() => setShowLocationModal(true)}
                    style={btnEditLocation}
                  >
                    ✏️ Ubicación
                  </button>
                </div>
              </>
            )}

            {rol === "PRODUCTOR" && (
              <>
                <p>
                  <b>Responsable:</b> {productor?.nombreResponsable}
                </p>
                <p>
                  <b>Teléfono:</b> {productor?.telefono}
                </p>
                <p>
                  <b>Establecimiento:</b>{" "}
                  {productor?.tipoEstablecimiento?.replace(/_/g, " ")}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <p style={{ margin: 0 }}>
                    <b>Ubicación:</b>{" "}
                    {productor?.localidad
                      ? productor.localidad
                      : productor?.latitud
                        ? "📍 Ubicada en mapa"
                        : "Falta ubicar en mapa"}
                  </p>
                  <button
                    onClick={() => setShowLocationModal(true)}
                    style={btnEditLocation}
                  >
                    ✏️ Ubicación
                  </button>
                </div>

                <div style={{ marginTop: "15px" }}>
                  <b>Categorías:</b>
                  <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
                    {productor?.productor_categorias?.map((pc) => (
                      <li key={pc.id}>{pc.categorias_produccion?.nombre}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Catálogo y Publicaciones */}
        <div
          style={{
            flex: "2",
            minWidth: "400px",
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "16px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          }}
        >
          {rol === "CONSUMIDOR" ? (
            <>
              <h3>Mi Actividad Reciente</h3>
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "#95a5a6",
                  border: "2px dashed #ecf0f1",
                  borderRadius: "8px",
                  marginTop: "1rem",
                }}
              >
                <p>
                  Tus compras coordinadas por WhatsApp aparecerán en "Mis
                  Pedidos".
                </p>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <h3 style={{ margin: 0 }}>Mis Publicaciones</h3>
                <button
                  onClick={() => setShowPublicarModal(true)}
                  style={{
                    padding: "10px 18px",
                    backgroundColor: "#16a34a",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  + Publicar{" "}
                  {rol === "PRODUCTOR" ? "Cosecha / Lote" : "Producto"}
                </button>
              </div>

              {!misPublicaciones || misPublicaciones.length === 0 ? (
                <div
                  style={{
                    padding: "3rem 2rem",
                    textAlign: "center",
                    color: "#95a5a6",
                    border: "2px dashed #ecf0f1",
                    borderRadius: "8px",
                  }}
                >
                  <p style={{ fontSize: "24px", margin: "0 0 10px 0" }}>🌾</p>
                  <p>Aún no tenés productos publicados en el catálogo.</p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "15px",
                  }}
                >
                  {misPublicaciones.map((pub) => (
                    <div
                      key={pub.id}
                      style={{
                        border: "1px solid #eee",
                        borderRadius: "12px",
                        padding: "15px",
                        position: "relative",
                      }}
                    >
                      {pub.esAlertaRadar && (
                        <span
                          style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            backgroundColor: "#fef3c7",
                            color: "#92400e",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          ⚡ Radar de Frescura
                        </span>
                      )}
                      <span
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          backgroundColor: pub.activo ? "#22c55e" : "#ef4444",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                        }}
                        title={pub.activo ? "Activo" : "Pausado"}
                      />

                      <h4 style={{ margin: "20px 0 6px 0" }}>{pub.titulo}</h4>
                      <p
                        style={{
                          margin: "5px 0",
                          color: "#7f8c8d",
                          fontSize: "13px",
                          height: "36px",
                          overflow: "hidden",
                        }}
                      >
                        {pub.descripcion || "Sin descripción"}
                      </p>

                      <h3 style={{ margin: "8px 0", color: "#16a34a" }}>
                        ${pub.precio}{" "}
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#777",
                            fontWeight: "normal",
                          }}
                        >
                          / {pub.unidadMedida}
                        </span>
                      </h3>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "12px",
                          color: "#555",
                          backgroundColor: "#f9f9f9",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          marginBottom: "10px",
                        }}
                      >
                        <span>
                          <b>Stock:</b> {pub.stock}
                        </span>
                        <span>
                          <b>Mínimo:</b> {pub.pedidoMinimo}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          borderTop: "1px solid #eee",
                          paddingTop: "10px",
                        }}
                      >
                        <button
                          onClick={() => handleEliminar(pub.id)}
                          style={{
                            width: "100%",
                            padding: "6px",
                            backgroundColor: "#fee2e2",
                            color: "#dc2626",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 1. MODAL DE LOCALIZACIÓN (LU) */}
      {showLocationModal && (
        <LocationModal
          forceOpen={true}
          initialData={{
            lat: perfilActivo?.latitud,
            lng: perfilActivo?.longitud,
            localidad: perfilActivo?.localidad,
            direccionReferencia: perfilActivo?.direccionReferencia,
          }}
          onClose={() => setShowLocationModal(false)}
          onSuccess={() => {
            setShowLocationModal(false);
            fetchProfile();
          }}
        />
      )}

      {/* 2. MODAL EDITAR PERFIL & VITRINA */}
      <EditarPerfilModal
        isOpen={showEditarPerfilModal}
        onClose={() => setShowEditarPerfilModal(false)}
        userRole={rol}
        initialData={perfilActivo}
        onPerfilActualizado={() => {
          fetchProfile();
        }}
      />

      {/* 3. MODAL PUBLICAR PRODUCTO */}
      <PublicarProductoModal
        isOpen={showPublicarModal}
        onClose={() => setShowPublicarModal(false)}
        userRole={rol}
        onPublicacionCreada={() => {
          fetchProfile();
        }}
      />
    </div>
  );
};

const btnEditLocation = {
  padding: "4px 8px",
  fontSize: "12px",
  backgroundColor: "#f39c12",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
