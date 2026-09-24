import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/public/Home';

// TODO: Crear estos componentes luego en la carpeta pages/
// import { RegisterConsumidor } from './pages/RegisterConsumidor';
// import { RegisterProductor } from './pages/RegisterProductor';
// import { RegisterEmprendimiento } from './pages/RegisterEmprendimiento';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Renderizamos únicamente el componente Home para probar la vista */}
        <Route path="/" element={<Home />} />
        
        {/* Rutas temporales comentadas para que no tiren error hasta que tu compañera termine */}
        {/* 
        <Route path="/register/consumidor" element={<h2>Registro Consumidor (Próximamente)</h2>} />
        <Route path="/register/productor" element={<h2>Registro Productor (Próximamente)</h2>} />
        <Route path="/register/emprendimiento" element={<h2>Registro Emprendimiento (Próximamente)</h2>} /> 
        */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;