import React, { useState } from "react";
import axios from "axios";

// Categorías del Productor (que elige el EMPRENDEDOR para abastecerse de materia prima)
const CATEGORIAS_PRODUCTOR = [
  {
    id: "FRUTIHORTICOLA",
    emoji: "🍌",
    nombre: "Fruticultura & Horticultura",
    desc: "Bananas primicia, cítricos, batatas, mandioca criolla",
  },
  {
    id: "APICULTURA",
    emoji: "🍯",
    nombre: "Apicultura & Miel de Monte",
    desc: "Miel pura de monte, polen, cera virgen de abejas",
  },
  {
    id: "GANADERIA",
    emoji: "🐂",
    nombre: "Ganadería & Derivados",
    desc: "Leche agroecológica, quesos de colonia, cueros",
  },
  {
    id: "PISCICULTURA",
    emoji: "🐟",
    nombre: "Piscicultura de Río",
    desc: "Pacú arrocero, boga y sábalo sustentable",
  },
  {
    id: "AGRICULTURA_EXTENSIVA",
    emoji: "🌱",
    nombre: "Agricultura Extensiva",
    desc: "Maíz criollo, porotos, harina de algarroba ancestral",
  },
  {
    id: "FORESTAL",
    emoji: "🪵",
    nombre: "Forestería Sustentable",
    desc: "Maderas certificadas, frutos nativos y tintes",
  },
];

// Categorías/Rubros de Emprendimientos (que elige el CONSUMIDOR para comprar productos elaborados)
const CATEGORIAS_EMPRENDIMIENTO = [
  {
    id: "ALIMENTOS_CONSERVAS",
    emoji: "🍯",
    nombre: "Alimentos & Conservas",
    desc: "Dulces regionales, escabeches, mermeladas y miel",
  },
  {
    id: "TEXTIL_ARTESANIAS",
    emoji: "🧵",
    nombre: "Textil & Identidad",
    desc: "Tejidos en chaguar, cestería qom, telares",
  },
  {
    id: "COSMETICA_NATURAL",
    emoji: "🌿",
    nombre: "Cosmética Natural & Bio",
    desc: "Jabones artesanales, aceites de monte",
  },
  {
    id: "RECICLAJE_SUSTENTABILIDAD",
    emoji: "♻️",
    nombre: "Reciclaje & Diseño Circular",
    desc: "Eco-objetos, bio-envases y accesorios",
  },
  {
    id: "SERVICIOS_PRODUCCION",
    emoji: "⚙️",
    nombre: "Servicios a la Producción",
    desc: "Fletes comunitarios, herramientas y asesoría técnica",
  },
];

export const OnboardingModal = ({
  isOpen,
  onClose,
  userRole = "CONSUMIDOR",
  userId,
}) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Si es EMPRENDIMIENTO, le mostramos materias primas de PRODUCTOR.
  // Si es CONSUMIDOR, le mostramos productos elaborados de EMPRENDIMIENTO.
  const esEmprendedor = userRole === "EMPRENDIMIENTO";
  const categoriasAMostrar = esEmprendedor
    ? CATEGORIAS_PRODUCTOR
    : CATEGORIAS_EMPRENDIMIENTO;

  const toggleCategory = (id) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      // Guardamos únicamente las categorías de interés para el algoritmo EcoMatch
      await axios.post("http://localhost:3000/api/usuarios/preferencias", {
        userId,
        categoriasInteres: selectedCategories,
      });
      onClose();
    } catch (error) {
      console.warn(
        "Backend aún no conectado o error, guardando preferencias localmente:",
        error,
      );
      // Guardado de respaldo en localStorage para que el front no se trabe en la demo
      localStorage.setItem(
        "ecomatch_preferencias",
        JSON.stringify(selectedCategories),
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-[620px] bg-white rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col border border-emerald-100">
        {/* Cabecera */}
        <div className="p-6 pb-3 relative flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
              🌱 Algoritmo EcoMatch •{" "}
              {esEmprendedor ? "Perfil Emprendimiento" : "Perfil Consumidor"}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
              title="Cerrar"
            >
              ✕
            </button>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900">
              ¡Te damos la bienvenida a EcoMatch!
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {esEmprendedor
                ? "¿Qué materias primas o insumos de chacra necesitás para tu producción local?"
                : "¿Qué productos elaborados y sustentables de Formosa te interesan descubrir?"}
            </p>
            <p className="text-xs text-emerald-700 font-medium mt-1">
              Elegí una o varias opciones para calibrar tu feed y destacar las
              mejores oportunidades.
            </p>
          </div>
        </div>

        {/* Grilla de Categorías Adaptativa al Rol */}
        <div className="px-6 py-2 overflow-y-auto max-h-[460px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {categoriasAMostrar.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <div
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex flex-col justify-between select-none ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/80 shadow-sm"
                      : "border-gray-100 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{cat.emoji}</span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-200 text-transparent"
                      }`}
                    >
                      ✓
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-semibold text-sm text-gray-900 leading-tight">
                      {cat.nombre}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {cat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pie con Contador y Botón Final */}
        <div className="p-6 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            {selectedCategories.length === 1
              ? "1 categoría seleccionada"
              : `${selectedCategories.length} categorías seleccionadas`}
          </span>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleFinish}
            className="px-6 py-2.5 rounded-full bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-800 shadow transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : "Comenzar a Explorar EcoMatch 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
};
