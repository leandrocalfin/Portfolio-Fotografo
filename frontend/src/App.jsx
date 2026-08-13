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

    if (!sectionId) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });

      return;
    }

    let cancelado = false;
    let timeoutFinal;
    let intervalo;

    const compensacion = 150;

    const posicionarSeccion = () => {
      if (cancelado) return false;

      // Servicios tiene carga asíncrona.
      // Esperamos a que termine antes de empezar.
      if (
        sectionId === "servicios" ||
        sectionId === "contacto"
      ) {
        const servicios =
          document.getElementById("servicios");

        if (
          !servicios ||
          servicios.dataset.cargando === "true"
        ) {
          return false;
        }
      }

      const section =
        document.getElementById(sectionId);

      if (!section) return false;

      if (sectionId === "inicio") {
        window.scrollTo({
          top: 0,
          behavior: "auto",
        });

        return true;
      }

      const titulo =
        section.querySelector(".text-center") ||
        section;

      const y =
        titulo.getBoundingClientRect().top +
        window.scrollY -
        compensacion;

      window.scrollTo({
        top: y,
        behavior: "auto",
      });

      return true;
    };

    const esperarSeccion = () => {
      if (cancelado) return;

      const listo = posicionarSeccion();

      if (!listo) {
        requestAnimationFrame(esperarSeccion);
        return;
      }

      /*
        IMPORTANTE:
        Durante los próximos 2 segundos seguimos
        corrigiendo la posición.

        Si UltimosTrabajos, imágenes, Swiper, etc.
        cambian la altura de la página, el scroll
        vuelve automáticamente al lugar correcto.
      */
      intervalo = setInterval(() => {
        posicionarSeccion();
      }, 100);

      timeoutFinal = setTimeout(() => {
        clearInterval(intervalo);

        // Última corrección cuando el layout
        // ya debería estar completamente estable.
        posicionarSeccion();

        // Ahora sí hacemos un pequeño scroll suave final.
        const section =
          document.getElementById(sectionId);

        if (
          section &&
          sectionId !== "inicio"
        ) {
          const titulo =
            section.querySelector(".text-center") ||
            section;

          const y =
            titulo.getBoundingClientRect().top +
            window.scrollY -
            compensacion;

          window.scrollTo({
            top: y,
            behavior: "smooth",
          });
        }
      }, 2000);
    };

    requestAnimationFrame(esperarSeccion);

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
    if (
      error.response &&
      (error.response.status === 401 ||
        error.response.status === 403)
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
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