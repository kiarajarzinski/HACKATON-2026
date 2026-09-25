import React, { useState, useEffect } from "react";
import axios from "axios";

export const EditarPerfilModal = ({
  isOpen,
  onClose,
  userRole = "PRODUCTOR",
  initialData = {},
  onPerfilActualizado,
}) => {
  const esProductor = userRole === "PRODUCTOR";

  // Estados del perfil
  const [historia, setHistoria] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [direccion, setDireccion] = useState("");

  // Fotos de perfil y galería
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [galeriaFiles, setGaleriaFiles] = useState([]);
  const [galeriaPreviews, setGaleriaPreviews] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Cargar datos iniciales si existen
  useEffect(() => {
    if (initialData) {
      setHistoria(initialData.historia || "");
      setWhatsapp(initialData.telefono || "");
      setDireccion(initialData.direccionReferencia || "");
      setAvatarPreview(initialData.fotoPerfil || "");
      setGaleriaPreviews(initialData.fotosGaleria || []);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Manejo de cambio de avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Manejo de fotos de galería
  const handleGaleriaChange = (e) => {
    const files = Array.from(e.target.files);
    if (galeriaPreviews.length + files.length > 5) {
      alert("Podés subir hasta 5 fotos para la vitrina.");
      return;
    }
    setGaleriaFiles([...galeriaFiles, ...files]);
    const nuevasPreviews = files.map((file) => URL.createObjectURL(file));
    setGaleriaPreviews([...galeriaPreviews, ...nuevasPreviews]);
  };

  const removeGaleriaFoto = (index) => {
    setGaleriaPreviews(galeriaPreviews.filter((_, i) => i !== index));
    setGaleriaFiles(galeriaFiles.filter((_, i) => i !== index));
  };

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("historia", historia);
      formData.append("telefono", whatsapp);
      formData.append("direccionReferencia", direccion);

      if (avatarFile) {
        formData.append("fotoPerfil", avatarFile);
      }

      galeriaFiles.forEach((file) => {
        formData.append("fotosGaleria", file);
      });

      // Llamada al backend de Lu
      await axios.patch("http://localhost:3000/api/perfil", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        if (onPerfilActualizado) onPerfilActualizado();
        onClose();
      }, 1200);
    } catch (error) {
      console.warn(
        "Backend aún desconectado, simulando actualización local:",
        error,
      );
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        if (onPerfilActualizado) onPerfilActualizado();
        onClose();
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-[650px] my-auto bg-white text-gray-900 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-emerald-100">
        {/* Cabecera */}
        <div className="px-6 pt-5 pb-3 bg-emerald-50/60 border-b border-gray-100 flex flex-col gap-1.5 relative">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              🌱 Gestión de Identidad y Vitrina •{" "}
              {esProductor ? "Productor" : "Emprendimiento"}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            Tu Identidad y Vitrina Productiva
          </h2>
          <p className="text-xs text-gray-500">
            {esProductor
              ? "Contale a la comunidad quién sos, cómo producís y mostrá tu chacra o colmenas."
              : "Mostrá tu taller, cómo elaborás tus productos y los insumos formoseños que transformás."}
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-5 text-gray-800"
        >
          {/* SECCIÓN 1: FOTO DE PERFIL / LOGO */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 shrink-0 border-2 border-emerald-600 shadow-sm">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">
                  {esProductor ? "🚜" : "🍯"}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-800">
                Foto Principal de Identidad
              </label>
              <p className="text-[11px] text-gray-500 leading-tight">
                Rostro del productor/elaborador o logo del emprendimiento (JPG o
                PNG hasta 5MB).
              </p>
              <label className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-300 hover:border-emerald-600 rounded-full text-xs font-medium cursor-pointer shadow-xs self-start transition text-gray-700 hover:text-emerald-700">
                📷 Cambiar foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* SECCIÓN 2: HISTORIA */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-gray-800">
                Nuestra Historia & Tradición Familiar
              </label>
              <span className="text-[10px] text-gray-400">
                {historia.length} / 400
              </span>
            </div>
            <textarea
              rows="3"
              maxLength={400}
              required
              value={historia}
              onChange={(e) => setHistoria(e.target.value)}
              placeholder={
                esProductor
                  ? "Contá hace cuántas generaciones trabajás la tierra, qué cultivás y tus métodos agroecológicos sin agroquímicos..."
                  : "Contá cómo nació tu emprendimiento, las recetas o técnicas tradicionales que usás y qué insumos de chacras locales transformás..."
              }
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-emerald-600 resize-none leading-relaxed"
            />
          </div>

          {/* SECCIÓN 3: VITRINA PRODUCTIVA / GALERÍA */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-gray-800">
                Vitrina Productiva / Galería del Entorno
              </label>
              <span className="text-[10px] text-gray-400">
                {galeriaPreviews.length} de 5 cargadas
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mb-2">
              Subí fotos reales mostrando tus surcos, cosechas, taller, cocina o
              colmenas.
            </p>

            {/* Previews de Galería */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
              {galeriaPreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-xs"
                >
                  <img
                    src={src}
                    alt="Galería"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeGaleriaFoto(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center shadow"
                  >
                    ✕
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                      Principal
                    </span>
                  )}
                </div>
              ))}

              {galeriaPreviews.length < 5 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-emerald-600 bg-gray-50 hover:bg-emerald-50/40 flex flex-col items-center justify-center cursor-pointer transition text-gray-400 hover:text-emerald-700">
                  <span className="text-lg">➕</span>
                  <span className="text-[9px] font-semibold mt-0.5">
                    Añadir
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGaleriaChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* SECCIÓN 4: DATOS DE CONTACTO Y TERRITORIO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                WhatsApp Venta Directa *
              </label>
              <div className="flex items-center px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs">
                <span className="mr-1.5 select-none">🇦🇷 +54 9</span>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="3704123456"
                  className="bg-transparent border-none outline-none w-full font-medium text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Paraje / Dirección de Referencia *
              </label>
              <input
                type="text"
                required
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder={
                  esProductor
                    ? "Ej: RN 86 Km 132, Laguna Naineck"
                    : "Ej: Barrio San Miguel, Formosa"
                }
                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Toast / Feedback dentro del modal */}
          {showFeedback && (
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 animate-pulse">
              <span>✓ ¡Perfil y vitrina actualizados con éxito!</span>
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
              className="px-6 py-2.5 rounded-full bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shadow transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios 💾"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
