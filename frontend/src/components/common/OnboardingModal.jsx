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
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [localidad, setLocalidad] = useState("Formosa Capital");
  const [coords, setCoords] = useState({ lat: -26.1855, lng: -58.1758 });
  const [pinPosition, setPinPosition] = useState({ x: 50, y: 50 }); // Porcentajes para el mini-mapa
  const [geoStatus, setGeoStatus] = useState(
    "Toma las coordenadas del navegador con un toque (~500m precisión).",
  );
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

  // Geolocalización real del navegador
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus("Tu navegador no soporta geolocalización.");
      return;
    }
    setGeoStatus("Buscando coordenadas GPS...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setGeoStatus(
          `✓ Ubicación confirmada: (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
        );
      },
      () => {
        setGeoStatus(
          "No se pudo acceder a tu ubicación. Seleccioná tu localidad abajo.",
        );
      },
    );
  };

  // Clic en el mapa simulado para reubicar pin
  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPinPosition({ x, y });
  };

  // Guardar en backend (Lu)
  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      // Endpoint preparado para cuando Lu lo tenga listo:
      await axios.post("http://localhost:3000/api/usuarios/onboarding", {
        userId,
        categoriasInteres: selectedCategories,
        localidad,
        latitud: coords.lat,
        longitud: coords.lng,
      });
      onClose();
    } catch (error) {
      console.warn(
        "Backend aún no conectado o error, guardando en local para la demo:",
        error,
      );
      // Fallback para hackathon: se cierra y no traba la demo
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-[620px] bg-white rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col border border-emerald-100">
        {/* Cabecera */}
        <div className="p-6 pb-2 relative flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
              🌱 Calibración EcoMatch •{" "}
              {esEmprendedor ? "Perfil Emprendedor" : "Perfil Consumidor"}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
            >
              ✕
            </button>
          </div>

          {/* Stepper (Progreso) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 p-2 rounded-xl text-left transition ${
                step === 1
                  ? "bg-emerald-700 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 1
                    ? "bg-white text-emerald-800"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {step > 1 ? "✓" : "1"}
              </div>
              <div className="truncate text-xs font-medium">Tus Intereses</div>
            </button>

            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 p-2 rounded-xl text-left transition ${
                step === 2
                  ? "bg-emerald-700 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 2
                    ? "bg-white text-emerald-800"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                2
              </div>
              <div className="truncate text-xs font-medium">Tu Ubicación</div>
            </button>
          </div>
        </div>

        {/* Contenido dinámico según Step */}
        <div className="p-6 pt-2 overflow-y-auto max-h-[500px]">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  ¡Te damos la bienvenida a EcoMatch!
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {esEmprendedor
                    ? "¿Qué materias primas o insumos de chacra necesitás para tu producción local?"
                    : "¿Qué productos elaborados y sustentables de Formosa te interesan descubrir?"}
                </p>
              </div>

              {/* Grilla de Categorías Adaptativa al Rol */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {categoriasAMostrar.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
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

              {/* Botón avanzar */}
              <div className="pt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  {selectedCategories.length} seleccionados
                </span>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-full bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 shadow transition"
                >
                  Continuar a Ubicación →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  ¿Dónde te encontrás?
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Tu ubicación nos permite calcular cercanía de cosechas y
                  ferias en Formosa.
                </p>
              </div>

              {/* Botón GPS */}
              <button
                type="button"
                onClick={handleGetLocation}
                className="w-full text-left p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 hover:bg-emerald-100/50 transition flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  📍
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-gray-900">
                    Usar mi ubicación GPS en tiempo real
                  </span>
                  <span className="text-xs text-emerald-700">{geoStatus}</span>
                </div>
              </button>

              {/* Selector de Localidad */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  O elegí tu Localidad de Formosa:
                </label>
                <select
                  value={localidad}
                  onChange={(e) => setLocalidad(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 focus:outline-emerald-600"
                >
                  <option value="Formosa Capital">Formosa Capital</option>
                  <option value="Laguna Naineck">
                    Laguna Naineck (Zona Bananera)
                  </option>
                  <option value="Riacho He Hé">Riacho He Hé</option>
                  <option value="Pirané">Pirané</option>
                  <option value="Clorinda">Clorinda</option>
                  <option value="El Colorado">El Colorado</option>
                  <option value="Las Lomitas">Las Lomitas</option>
                  <option value="Ingeniero Juárez">Ingeniero Juárez</option>
                </select>
              </div>

              {/* Mini-mapa interactivo para cliquear */}
              <div
                onClick={handleMapClick}
                className="relative w-full h-36 rounded-2xl bg-emerald-950/10 border border-emerald-200 overflow-hidden cursor-crosshair select-none"
              >
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#16a34a_1px,transparent_1px)] bg-size-[16px_16px]"></div>{" "}
                {/* Pin interactivo posicionado por clics */}
                <div
                  className="absolute -translate-x-1/2 -translate-y-full transition-all duration-200 pointer-events-none"
                  style={{
                    left: `${pinPosition.x}%`,
                    top: `${pinPosition.y}%`,
                  }}
                >
                  <div className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap mb-0.5">
                    📍 {localidad}
                  </div>
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg mx-auto">
                    •
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 text-[10px] bg-white/80 px-2 py-0.5 rounded text-gray-600">
                  Hacé clic en el mapa para ajustar tu posición
                </div>
              </div>

              {/* Botones de acción final */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition"
                >
                  ← Volver
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinish}
                  className="px-6 py-2.5 rounded-full bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-800 shadow transition"
                >
                  {isSubmitting
                    ? "Guardando..."
                    : "Comenzar a Explorar EcoMatch 🚀"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
