import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Inicio from './pages/Inicio';
import GaleriaCompleta from './pages/GaleriaCompleta';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DetalleTrabajo from './pages/DetalleTrabajo'; 
import WhatsApp from './components/WhatsApp';
import Footer from './components/Footer';
import axios from 'axios';

// ==========================================
// VIGILANTE GLOBAL DE SESIÓN (INTERCEPTOR)
// ==========================================
axios.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, la deja pasar normal
    return response;
  },
  (error) => {
    // Si el servidor responde que el token venció o no sirve (401 / 403)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      // 1. Borramos el token muerto
      localStorage.removeItem('token'); // (O sessionStorage si elegiste el paso 1)
      
      // 2. Lo mandamos al login a la fuerza
      window.location.href = '/login';
    }
    
    // Si es otro tipo de error (ej: formulario incompleto), lo devuelve para que tu app lo maneje
    return Promise.reject(error);
  }
);

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