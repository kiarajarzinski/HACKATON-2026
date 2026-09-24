import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/auth/Navbar';
// TODO: Crear estos componentes luego en la carpeta pages/
// import { RegisterConsumidor } from './pages/RegisterConsumidor';
// import { RegisterProductor } from './pages/RegisterProductor';
// import { RegisterEmprendimiento } from './pages/RegisterEmprendimiento';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<h2 className="p-4">Bienvenido al Home</h2>} />
        
        {/* Rutas temporales para que no tire error hasta que crees los archivos */}
        <Route path="/register/consumidor" element={<h2>Registro Consumidor (Próximamente)</h2>} />
        <Route path="/register/productor" element={<h2>Registro Productor (Próximamente)</h2>} />
        <Route path="/register/emprendimiento" element={<h2>Registro Emprendimiento (Próximamente)</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

//Solo importa el <AppRouter /> y los <ContextProviders>