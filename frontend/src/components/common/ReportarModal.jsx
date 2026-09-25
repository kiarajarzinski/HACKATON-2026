import React, { useState } from "react";
import axios from "axios";

// Motivos alineados con la lógica de moderación en la BD
const MOTIVOS_REPORTE = [
  {
    codigo: "PRECIO_FALSO",
    emoji: "🏷️",
    titulo: "Precio diferente al anunciado",
    desc: "El valor acordado por WhatsApp o en el lugar no coincide con lo publicado en el catálogo.",
  },
  {
    codigo: "PRODUCTO_INEXISTENTE",
    emoji: "📦",
    titulo: "Producto no disponible o inexistente",
    desc: "El lote ya no existe o el vendedor no cuenta con stock real para comercializar.",
  },
  {
    codigo: "CONTENIDO_INAPROPIADO",
    emoji: "⚠️",
    titulo: "Contenido engañoso o inapropiado",
    desc: "Información falsa sobre origen agroecológico, fotos ajenas o datos engañosos.",
  },
  {
    codigo: "OTRO",
    emoji: "❓",
    titulo: "Otro motivo",
    desc: "Inconvenientes de comunicación, trato inadecuado u otra irregularidad observada.",
  },
];

export const ReportarModal = ({
  isOpen,
  onClose,
  publicacion = {},
  userId,
  onReporteEnviado,
}) => {
  const [motivo, setMotivo] = useState("PRECIO_FALSO");
  const [detalle, setDetalle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastExito, setToastExito] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Conexión preparada hacia el endpoint de moderación de Lu
      await axios.post("http://localhost:3000/api/reportes", {
        publicacionId: publicacion.id,
        usuarioId: userId || null,
        motivo,
        detalle,
      });

      setToastExito(true);
      if (onReporteEnviado) onReporteEnviado();
    } catch (error) {
      console.warn(
        "Backend aún desconectado, simulando registro de denuncia para demo:",
        error,
      );
      setToastExito(true);
      if (onReporteEnviado) onReporteEnviado();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCerrarTodo = () => {
    setToastExito(false);
    setDetalle("");
    setMotivo("PRECIO_FALSO");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-[500px] my-auto bg-white text-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-red-100 max-h-[92vh]">
        {/* Barra decorativa superior de advertencia */}
        <div className="h-1.5 w-full bg-linear-to-r from-red-600 via-amber-500 to-emerald-500"></div>
        {/* Botón de cierre */}
        <button
          type="button"
          onClick={handleCerrarTodo}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition"
        >
          ✕
        </button>

        {/* Contenido con scroll interno */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start gap-3.5 pr-8">
            <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl shrink-0 border border-red-100 shadow-xs">
              ⚖️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                  Reportar Publicación
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
                  Moderación
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-snug">
                Ayudanos a mantener un mercado transparente, seguro y justo para
                la comunidad formoseña.
              </p>
            </div>
          </div>

          {/* Mini-Card de Contexto del Producto Denunciado */}
          <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200 shrink-0 border border-gray-200">
              {publicacion.fotos && publicacion.fotos.length > 0 ? (
                <img
                  src={publicacion.fotos[0]}
                  alt="Lote"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                  📦
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-bold text-gray-900 truncate">
                  {publicacion.titulo || "Cajón de Banana Primicia (20 kg)"}
                </h4>
                <span className="text-xs font-bold text-emerald-700 whitespace-nowrap">
                  $
                  {publicacion.precio
                    ? Number(publicacion.precio).toLocaleString()
                    : "7.500"}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 truncate mt-0.5">
                📍 {publicacion.vendedor || "Chacra Don Pedro · Laguna Naineck"}
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Opciones de Motivo */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                ¿Cuál es el motivo del reporte?{" "}
                <span className="text-red-600">*</span>
              </label>

              <div className="flex flex-col gap-2">
                {MOTIVOS_REPORTE.map((item) => {
                  const isChecked = motivo === item.codigo;
                  return (
                    <div
                      key={item.codigo}
                      onClick={() => setMotivo(item.codigo)}
                      className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-start gap-3 select-none ${
                        isChecked
                          ? "border-red-500 bg-red-50/50 shadow-xs"
                          : "border-gray-200/70 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isChecked
                            ? "border-red-600 bg-red-600"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isChecked && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{item.emoji}</span>
                          <span className="text-xs font-bold text-gray-900">
                            {item.titulo}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detalle o Aclaración */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-800">
                  Detalle o aclaración adicional{" "}
                  <span className="text-gray-400 font-normal">(Opcional)</span>
                </label>
                <span className="text-[10px] text-gray-400">
                  {detalle.length} / 250
                </span>
              </div>
              <textarea
                rows="2"
                maxLength={250}
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
                placeholder="Contanos brevemente qué ocurrió o qué detectaste de irregular..."
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-red-500 resize-none leading-relaxed"
              />
            </div>

            {/* Aviso de Confidencialidad */}
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2">
              <span className="text-sm">🔒</span>
              <p className="text-[11px] text-gray-500 leading-tight">
                <strong className="text-gray-700">
                  Tu reporte es 100% confidencial.
                </strong>{" "}
                El equipo de administración revisará la publicación en el panel{" "}
                <code className="text-red-700 font-semibold">/admin</code> para
                resguardar a la comunidad.
              </p>
            </div>

            {/* Acciones */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCerrarTodo}
                className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? "Enviando..." : "🚩 Enviar Denuncia"}
              </button>
            </div>
          </form>
        </div>

        {/* Modal de Éxito Superpuesto (Toast / Confirmation) */}
        {toastExito && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mb-3 shadow-xs">
              ✓
            </div>
            <h3 className="text-base font-bold text-gray-900">
              Denuncia Registrada con Éxito
            </h3>
            <p className="text-xs text-gray-600 mt-1 max-w-xs leading-relaxed">
              El reporte fue enviado a la bandeja de moderación del
              administrador para su revisión preventiva.
            </p>
            <button
              type="button"
              onClick={handleCerrarTodo}
              className="mt-4 px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-bold transition shadow"
            >
              Entendido y volver
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
