import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Inicio from './pages/Inicio';
import GaleriaCompleta from './pages/GaleriaCompleta';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DetalleTrabajo from './pages/DetalleTrabajo'; 
import WhatsApp from './components/WhatsApp';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      {/* 1. Cambiamos bg-fondo-oceano por bg-neutral-950 para mantener la elegancia oscura */}
      <div className="min-h-screen bg-neutral-950 font-textos flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/galeria" element={<GaleriaCompleta />} />
            <Route path="/trabajo/:id" element={<DetalleTrabajo />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        
        <Footer />
        
        {/* 2. Colocamos el componente WhatsApp aquí para que flote sobre cualquier página */}
        <WhatsApp />
      </div>
    </Router>
  );
}

export default App;