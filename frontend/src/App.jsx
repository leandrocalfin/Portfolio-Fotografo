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
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

function App() {
  return (
    <Router>
      {/* Contenedor principal con soporte dinámico para modo claro y oscuro */}
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-textos flex flex-col transition-colors duration-300">
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
        
        <WhatsApp />
      </div>
    </Router>
  );
}

export default App;