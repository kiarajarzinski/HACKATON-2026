import React, { useState } from "react";
import axios from "axios";

// Categorías del Productor (6 macrocategorías agrícolas de Formosa)
const CATEGORIAS_PRODUCTOR = [
  {
    id: "FRUTIHORTICOLA",
    nombre: "Fruticultura y Horticultura (Bananas, mandioca, etc.)",
  },
  { id: "APICULTURA", nombre: "Apicultura (Miel pura de monte nativo)" },
  { id: "GANADERIA", nombre: "Ganadería y Derivados" },
  { id: "PISCICULTURA", nombre: "Piscicultura de Río" },
  {
    id: "AGRICULTURA_EXTENSIVA",
    nombre: "Agricultura Extensiva (Maíz, porotos)",
  },
  { id: "FORESTAL", nombre: "Forestería Sustentable" },
];

// Rubros del Emprendedor (5 rubros de transformación local)
const RUBROS_EMPRENDEDOR = [
  {
    id: "ALIMENTOS_CONSERVAS",
    nombre: "Alimentos & Conservas (Dulces, mermeladas, escabeches)",
  },
  {
    id: "TEXTIL_ARTESANIAS",
    nombre: "Textil & Identidad (Chaguar, cestería, telares)",
  },
  { id: "COSMETICA_NATURAL", nombre: "Cosmética Natural & Bioinsumos" },
  { id: "RECICLAJE_SUSTENTABILIDAD", nombre: "Reciclaje & Diseño Circular" },
  { id: "SERVICIOS_PRODUCCION", nombre: "Servicios para la Producción" },
];

export const PublicarProductoModal = ({
  isOpen,
  onClose,
  userRole = "PRODUCTOR",
  onPublicacionCreada,
}) => {
  // Mutabilidad por rol
  const esProductor = userRole === "PRODUCTOR";

  // Estados de la publicación (Tabla publicaciones)
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState(
    esProductor ? "FRUTIHORTICOLA" : "ALIMENTOS_CONSERVAS",
  );
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [unidadMedida, setUnidadMedida] = useState(
    esProductor ? "CAJON" : "FRASCO",
  );
  const [stock, setStock] = useState(10);
  const [pedidoMinimo, setPedidoMinimo] = useState(esProductor ? 2 : 1);

  // Imágenes (Para Multer y Bucket 'publicaciones')
  const [fotos, setFotos] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Solo para Productores: Radar de Frescura
  const [esAlertaRadar, setEsAlertaRadar] = useState(false);
  const [motivoAlerta, setMotivoAlerta] = useState("COSECHA_DEL_DIA");
  const [precioOferta, setPrecioOferta] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Manejo de fotos locales
  const handleFotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + fotos.length > 3) {
      alert("Podés subir hasta 3 fotos del producto.");
      return;
    }
    setFotos([...fotos, ...files]);
    const nuevasPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...nuevasPreviews]);
  };

  const removeFoto = (index) => {
    setFotos(fotos.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  // Guardar publicación
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("categoria", categoria);
      formData.append("descripcion", descripcion);
      formData.append("precio", precio);
      formData.append("unidadMedida", unidadMedida);
      formData.append("stock", stock);
      formData.append("pedidoMinimo", pedidoMinimo);

      // Si es productor, mandamos los datos del Radar de Frescura
      if (esProductor) {
        formData.append("esAlertaRadar", esAlertaRadar);
        if (esAlertaRadar) {
          formData.append("motivoAlerta", motivoAlerta);
          if (precioOferta) formData.append("precioOferta", precioOferta);
        }
      } else {
        // Los emprendedores no van al radar de frescura
        formData.append("esAlertaRadar", false);
      }

      // Fotos para Multer
      fotos.forEach((foto) => {
        formData.append("fotos", foto);
      });

      // Llamada lista para Lu
      await axios.post("http://localhost:3000/api/publicaciones", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (onPublicacionCreada) onPublicacionCreada();
      onClose();
    } catch (error) {
      console.warn(
        "Backend aún desconectado, simulando guardado en front:",
        error,
      );
      if (onPublicacionCreada) onPublicacionCreada();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-[640px] my-auto bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-emerald-100">
        {/* Encabezado */}
        <div className="relative px-6 pt-5 pb-3 border-b border-gray-100 bg-emerald-50/50">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition"
          >
            ✕
          </button>

          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-1">
            🌱{" "}
            {esProductor
              ? "Alta de Cosecha (Productor)"
              : "Alta de Producto Elaborado (Emprendimiento)"}
          </span>
          <h2 className="text-xl font-bold text-gray-900 leading-snug">
            Publicar en el Catálogo
          </h2>
          <p className="text-xs text-gray-500">
            {esProductor
              ? "Ofrecé tu lote de cosecha a emprendedores de Formosa."
              : "Publicá tus productos elaborados para que los consumidores los descubran."}
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-800"
        >
          {/* Título */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Título del Producto o Lote *
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder={
                esProductor
                  ? "Ej: Cajón de Banana Primicia Seleccionada (20 kg)"
                  : "Ej: Dulce de Mamón en Almíbar Artesanal (450g)"
              }
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-emerald-600"
            />
          </div>

          {/* Categoría adaptable */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Categoría / Rubro *
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-emerald-600"
            >
              {(esProductor ? CATEGORIAS_PRODUCTOR : RUBROS_EMPRENDEDOR).map(
                (cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">
                Descripción & Métodos *
              </label>
              <span className="text-[10px] text-gray-400">
                {descripcion.length}/300
              </span>
            </div>
            <textarea
              rows="2"
              maxLength={300}
              required
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder={
                esProductor
                  ? "Cosechado al amanecer en Laguna Naineck, cultivo sin agroquímicos..."
                  : "Elaboración casera tradicional con frutas locales..."
              }
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-emerald-600 resize-none"
            />
          </div>

          {/* Precios y Unidades */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Precio ($ ARS) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="10000"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Unidad *
              </label>
              <select
                value={unidadMedida}
                onChange={(e) => setUnidadMedida(e.target.value)}
                className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-emerald-600"
              >
                {esProductor ? (
                  <>
                    <option value="CAJON">CAJÓN</option>
                    <option value="KG">KILO (KG)</option>
                    <option value="BOLSON">BOLSÓN</option>
                    <option value="LOTE">LOTE</option>
                  </>
                ) : (
                  <>
                    <option value="FRASCO">FRASCO</option>
                    <option value="UNIDAD">UNIDAD</option>
                    <option value="DOCENA">DOCENA</option>
                    <option value="KG">KILO (KG)</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                required
                min="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {esProductor ? "Ped. Mínimo *" : "Venta Mínima"}
              </label>
              <input
                type="number"
                required
                min="1"
                value={pedidoMinimo}
                onChange={(e) => setPedidoMinimo(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Fotos */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">
                Fotos del Producto / Lote
              </label>
              <span className="text-[10px] text-gray-400">
                {fotos.length} de 3 cargadas
              </span>
            </div>

            <div className="flex items-center gap-3">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                >
                  <img
                    src={src}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFoto(i)}
                    className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {fotos.length < 3 && (
                <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 hover:border-emerald-600 bg-gray-50 hover:bg-emerald-50/50 flex flex-col items-center justify-center cursor-pointer transition text-gray-400 hover:text-emerald-700">
                  <span className="text-lg">📷</span>
                  <span className="text-[9px] font-semibold">Subir</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* SECCIÓN DEL RADAR DE FRESCURA (SOLO VISIBLE PARA PRODUCTORES) */}
          {esProductor && (
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-gray-900 flex items-center gap-1 cursor-pointer">
                    ⚡ Activar en el Radar de Frescura
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Cosecha del Día
                    </span>
                  </label>
                  <p className="text-[11px] text-gray-500">
                    Destaca tu cosecha en el carrusel superior del Home antes de
                    que se pierda.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={esAlertaRadar}
                  onChange={(e) => setEsAlertaRadar(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </div>

              {esAlertaRadar && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-emerald-200/60">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                      Motivo
                    </label>
                    <select
                      value={motivoAlerta}
                      onChange={(e) => setMotivoAlerta(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    >
                      <option value="COSECHA_DEL_DIA">COSECHA DEL DÍA</option>
                      <option value="FIN_DE_TEMPORADA">FIN DE TEMPORADA</option>
                      <option value="OFERTA_EXCEDENTE">OFERTA EXCEDENTE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                      Precio de Oferta ($ Opcional)
                    </label>
                    <input
                      type="number"
                      value={precioOferta}
                      onChange={(e) => setPrecioOferta(e.target.value)}
                      placeholder="Ej: 8500"
                      className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botones de acción */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-full bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shadow transition disabled:opacity-50"
            >
              {isSubmitting ? "Publicando..." : "Publicar Ahora 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
