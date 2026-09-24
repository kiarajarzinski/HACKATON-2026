import { useState } from 'react';
import { RoleModal } from '../components/auth/RoleModal';

export const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <nav className="p-4 bg-gray-100 flex justify-between items-center">
      <h1 className="font-bold text-xl">Mi Hackathon</h1>
      
      <div>
        <button className="mr-4 text-blue-600 font-semibold">Iniciar Sesión</button>
        {/* Este botón abre el modal */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded font-bold"
        >
          Registrarse
        </button>
      </div>

      {/* Renderizamos el modal, pasándole el estado y la función para cerrarlo */}
      <RoleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </nav>
  );
};