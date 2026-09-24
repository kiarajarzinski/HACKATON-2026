import { useNavigate } from 'react-router-dom';

export const RoleModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;

  const handleSelectRole = (rol) => {
    onClose(); // Cerramos el modal
    navigate(`/register/${rol}`); // Redirigimos a la ruta correspondiente
  };

  return (
    // Fondo oscuro semi-transparente
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      {/* Contenedor del Modal */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
        {/* Botón de cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 font-bold"
        >
          X
        </button>

        <h2 className="text-xl font-bold mb-6 text-center">¿Cómo querés registrarte?</h2>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => handleSelectRole('consumidor')} 
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded font-semibold transition"
          >
            👤 Soy Consumidor
            <p className="text-xs font-normal opacity-80 mt-1">Quiero explorar y comprar</p>
          </button>
          
          <button 
            onClick={() => handleSelectRole('productor')} 
            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold transition"
          >
            🌾 Soy Productor
            <p className="text-xs font-normal opacity-80 mt-1">Chacra, Quinta, Campo, Finca</p>
          </button>
          
          <button 
            onClick={() => handleSelectRole('emprendimiento')} 
            className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-semibold transition"
          >
            🛠️ Soy Emprendimiento
            <p className="text-xs font-normal opacity-80 mt-1">Alimentos, Textil, Servicios</p>
          </button>
        </div>
      </div>
    </div>
  );
};