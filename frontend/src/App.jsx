import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio";
import GaleriaCompleta from "./pages/GaleriaCompleta";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DetalleTrabajo from "./pages/DetalleTrabajo";
import WhatsApp from "./components/WhatsApp";
import Footer from "./components/Footer";

import axios from "axios";

// ==========================================
// CONTROL GLOBAL DEL SCROLL
// ==========================================

const ScrollManager = () => {
  const location = useLocation();

  useEffect(() => {
    const sectionId = location.state?.scrollTo;

    // Si navegamos normalmente a una página,
    // simplemente comenzamos arriba.
    if (!sectionId) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });

      return;
    }

    let cancelado = false;
    let intervalo = null;
    let timeoutFinal = null;

    const compensacion = 150;

    const posicionarSeccion = () => {
      if (cancelado) return false;

      const section = document.getElementById(sectionId);

      // Esperamos solamente hasta que React monte la sección.
      if (!section) {
        return false;
      }

      if (sectionId === "inicio") {
        window.scrollTo({
          top: 0,
          behavior: "auto",
        });

        return true;
      }

      const titulo =
        section.querySelector(".text-center") || section;

      const y =
        titulo.getBoundingClientRect().top +
        window.scrollY -
        compensacion;

      // Movimiento inmediato.
      // Evita mostrar Inicio durante un segundo
      // antes de bajar a Servicios o Contacto.
      window.scrollTo({
        top: y,
        behavior: "auto",
      });

      return true;
    };

    const esperarMontaje = () => {
      if (cancelado) return;

      const existe = posicionarSeccion();

      if (!existe) {
        requestAnimationFrame(esperarMontaje);
        return;
      }

      /*
        Una vez que llegamos a la sección,
        seguimos corrigiendo la posición durante
        un pequeño período mientras React,
        imágenes, Swiper y datos de la API
        terminan de acomodar la página.
      */

      intervalo = setInterval(() => {
        posicionarSeccion();
      }, 100);

      timeoutFinal = setTimeout(() => {
        if (intervalo) {
          clearInterval(intervalo);
        }

        // Posición definitiva.
        posicionarSeccion();
      }, 2000);
    };

    requestAnimationFrame(esperarMontaje);

    return () => {
      cancelado = true;

      if (intervalo) {
        clearInterval(intervalo);
      }

      if (timeoutFinal) {
        clearTimeout(timeoutFinal);
      }
    };
  }, [location.pathname, location.state]);

  return null;
};

// ==========================================
// VIGILANTE GLOBAL DE SESIÓN
// ==========================================

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const token = localStorage.getItem("token");

    // Solo mandar al login si HABÍA una sesión iniciada
    // y ese token dejó de ser válido.
    if (
      token &&
      (status === 401 || status === 403)
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("ultimaActividad");

      // Evitamos recargar /login una y otra vez
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// ==========================================
// APP
// ==========================================

function App() {
  return (
    <Router>
      <ScrollManager />

      <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-textos flex flex-col transition-colors duration-300">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Inicio />} />

            <Route
              path="/galeria"
              element={<GaleriaCompleta />}
            />

            <Route
              path="/trabajo/:id"
              element={<DetalleTrabajo />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
          </Routes>
        </main>

        <Footer />

        <WhatsApp />
      </div>
    </Router>
  );
}

export default App;