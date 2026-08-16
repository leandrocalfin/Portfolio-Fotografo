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

    // Navegación normal:
    // comenzar arriba de la página.
    if (!sectionId) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      return;
    }

    let cancelado = false;
    let timeoutCorreccion = null;

    const compensacion = 150;

    const posicionarSeccion = () => {
      if (cancelado) return false;

      const section =
        document.getElementById(sectionId);

      // Esperar hasta que React haya montado la sección.
      if (!section) {
        return false;
      }

      // Si queremos volver a Inicio.
      if (sectionId === "inicio") {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto",
        });

        return true;
      }

      // Intentamos tomar el encabezado de la sección.
      const titulo =
        section.querySelector(".text-center") ||
        section;

      const y =
        titulo.getBoundingClientRect().top +
        window.scrollY -
        compensacion;

      // Movimiento inmediato.
      window.scrollTo({
        top: y,
        left: 0,
        behavior: "auto",
      });

      return true;
    };

    const esperarMontaje = () => {
      if (cancelado) return;

      const existe =
        posicionarSeccion();

      // Si la sección todavía no existe,
      // esperamos al próximo frame.
      if (!existe) {
        requestAnimationFrame(
          esperarMontaje
        );

        return;
      }

      /*
        Hacemos UNA sola corrección adicional
        después de un pequeño tiempo.

        Esto permite que imágenes, Swiper o datos
        terminen de acomodar un poco el layout,
        pero evita estar forzando el scroll cada
        100 ms durante varios segundos.
      */
      timeoutCorreccion = setTimeout(() => {
        if (!cancelado) {
          posicionarSeccion();
        }
      }, 250);
    };

    requestAnimationFrame(
      esperarMontaje
    );

    return () => {
      cancelado = true;

      if (timeoutCorreccion) {
        clearTimeout(timeoutCorreccion);
      }
    };
  }, [
    location.pathname,
    location.state,
  ]);

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
    const status =
      error.response?.status;

    const token =
      localStorage.getItem("token");

    // Solo mandar al login si existía una
    // sesión y el token dejó de ser válido.
    if (
      token &&
      (status === 401 ||
        status === 403)
    ) {
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "ultimaActividad"
      );

      // Evitamos recargar /login
      // si ya estamos ahí.
      if (
        window.location.pathname !==
        "/login"
      ) {
        window.location.href =
          "/login";
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

      <div
        className="
          min-h-screen
          bg-white
          dark:bg-neutral-950
          text-neutral-900
          dark:text-neutral-100
          font-textos
          flex
          flex-col
          transition-colors
          duration-300
        "
      >
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={<Inicio />}
            />

            <Route
              path="/galeria"
              element={
                <GaleriaCompleta />
              }
            />

            <Route
              path="/trabajo/:id"
              element={
                <DetalleTrabajo />
              }
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