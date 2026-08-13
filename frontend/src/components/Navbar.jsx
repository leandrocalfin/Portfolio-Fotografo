import { useState, useEffect, useRef } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import axios from "axios";

import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  const [menuAbierto, setMenuAbierto] =
    useState(false);

  const [usuario, setUsuario] = useState(null);

  const [dropdownAbierto, setDropdownAbierto] =
    useState(false);

  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  const esPaginaInterna = location.pathname !== "/";

  // ==========================================
  // OBTENER DATOS DEL ADMIN
  // ==========================================

  useEffect(() => {
    const obtenerDatosAdmin = async () => {
      if (!token) return;

      try {
        const respuesta = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/usuarios/perfil`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsuario(respuesta.data);
      } catch (error) {
        console.error(
          "Error al obtener perfil en navbar:",
          error
        );
      }
    };

    obtenerDatosAdmin();
  }, [token]);

  // ==========================================
  // CERRAR DROPDOWN AL HACER CLICK AFUERA
  // ==========================================

  useEffect(() => {
    const cerrarAfuera = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownAbierto(false);
      }
    };

    document.addEventListener(
      "mousedown",
      cerrarAfuera
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        cerrarAfuera
      );
  }, []);

  // ==========================================
  // DETECTAR SCROLL
  // ==========================================

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const cerrarMenu = () =>
    setMenuAbierto(false);

  // ==========================================
  // NAVEGAR A SECCIONES DEL INICIO
  // ==========================================

  const scrollToSection = (sectionId) => {
    cerrarMenu();

    // Si ya estamos en Inicio
    if (location.pathname === "/") {
      if (sectionId === "inicio") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return;
      }

      const section = document.getElementById(sectionId);

      if (section) {
        const titulo =
          section.querySelector(".text-center") || section;

        const compensacion = 150;

        const y =
          titulo.getBoundingClientRect().top +
          window.scrollY -
          compensacion;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }

      return;
    }

    // Si venimos desde Galería u otra página
    navigate("/", {
      state: {
        scrollTo: sectionId,
      },
    });
  };

  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  const manejarCerrarSesion = () => {
    localStorage.removeItem("token");

    localStorage.removeItem(
      "ultimaActividad"
    );

    setDropdownAbierto(false);

    cerrarMenu();

    navigate("/");

    window.location.reload();
  };

  // ==========================================
  // AJUSTES PERFIL
  // ==========================================

  const irAjustesPerfil = () => {
  setDropdownAbierto(false);
  cerrarMenu();

  navigate("/dashboard", {
    state: {
      scrollTo: "ajustes-perfil"
    }
  });
};

  const navbarSolido =
    scrolled ||
    menuAbierto ||
    esPaginaInterna;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${navbarSolido
        ? "bg-crema-suave dark:bg-neutral-950 border-b border-neutral-300/60 dark:border-white/5 shadow-md"
        : "bg-transparent border-transparent pt-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-24">

          {/* LOGO */}

          <button
            onClick={() =>
              scrollToSection("inicio")
            }
            className="flex items-center gap-3 group z-50 cursor-pointer"
          >
            <img
              src={
                navbarSolido &&
                  document.documentElement.classList.contains(
                    "dark"
                  ) === false
                  ? "/logo.png"
                  : "/logo2.png"
              }
              alt="MB Fotografía"
              className="h-10 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />

            <span
              className={`text-xl md:text-2xl tracking-widest font-bold transition-colors ${navbarSolido
                ? "text-neutral-900 dark:text-white"
                : "text-white"
                }`}
            >
              FOTOGRAFÍA
            </span>
          </button>

          {/* MOBILE */}

          <div className="flex items-center gap-4 md:hidden z-50">
            <ThemeToggle />

            <button
              className="text-neutral-900 dark:text-white focus:outline-none"
              onClick={() =>
                setMenuAbierto(
                  !menuAbierto
                )
              }
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuAbierto ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* NAVEGACIÓN */}

          <div
            className={`
              absolute md:static top-0 left-0 w-full md:w-auto h-screen md:h-auto
              flex flex-col md:flex-row items-center justify-center md:justify-end
              space-y-8 md:space-y-0 md:space-x-8 lg:space-x-10
              transition-all duration-500 ease-in-out
              ${menuAbierto
                ? "bg-crema-suave dark:bg-neutral-950 translate-y-0 opacity-100"
                : "-translate-y-full md:translate-y-0 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto"
              }
            `}
          >

            <button
              onClick={() =>
                scrollToSection("inicio")
              }
              className={`text-sm md:text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 relative group cursor-pointer ${navbarSolido
                ? "text-neutral-900 dark:text-neutral-300 hover:text-azul-logo dark:hover:text-white"
                : "text-white/90 hover:text-white"
                }`}
            >
              Inicio

              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full" />
            </button>

            <button
              onClick={() =>
                scrollToSection("sobre-mi")
              }
              className={`text-sm md:text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 relative group cursor-pointer ${navbarSolido
                ? "text-neutral-900 dark:text-neutral-300 hover:text-azul-logo dark:hover:text-white"
                : "text-white/90 hover:text-white"
                }`}
            >
              Sobre Mí

              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full" />
            </button>

            <Link
              to="/galeria"
              onClick={cerrarMenu}
              className={`text-sm md:text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 relative group ${navbarSolido
                ? "text-neutral-900 dark:text-neutral-300 hover:text-azul-logo dark:hover:text-white"
                : "text-white/90 hover:text-white"
                }`}
            >
              Galería

              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full" />
            </Link>

            <button
              onClick={() =>
                scrollToSection("servicios")
              }
              className={`text-sm md:text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 relative group cursor-pointer ${navbarSolido
                ? "text-neutral-900 dark:text-neutral-300 hover:text-azul-logo dark:hover:text-white"
                : "text-white/90 hover:text-white"
                }`}
            >
              Servicios

              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full" />
            </button>

            <button
              onClick={() =>
                scrollToSection("contacto")
              }
              className={`text-sm md:text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 relative group cursor-pointer ${navbarSolido
                ? "text-neutral-900 dark:text-neutral-300 hover:text-azul-logo dark:hover:text-white"
                : "text-white/90 hover:text-white"
                }`}
            >
              Contacto

              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full" />
            </button>

            {/* USUARIO */}

            {token ? (
              <div
                className="relative"
                ref={dropdownRef}
              >
                <button
                  onClick={() =>
                    setDropdownAbierto(
                      !dropdownAbierto
                    )
                  }
                  className="w-11 h-11 rounded-full overflow-hidden border-2 border-azul-logo focus:outline-none flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 cursor-pointer shadow-md hover:scale-105 transition-transform"
                >
                  {usuario?.avatar ? (
                    <img
                      src={usuario.avatar}
                      alt="Admin Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-neutral-800 dark:text-white uppercase">
                      {usuario?.email
                        ? usuario.email[0]
                        : "A"}
                    </span>
                  )}
                </button>

                {dropdownAbierto && (
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-neutral-900 border border-neutral-300/40 dark:border-white/10 shadow-2xl py-2 z-50 text-left">

                    {/* USUARIO CONECTADO */}
                    <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                        Michael Bogue
                      </p>

                      <p className="text-xs text-neutral-900 dark:text-white truncate font-medium mt-0.5">
                        {usuario?.email}
                      </p>
                    </div>

                    {/* CONFIGURAR PERFIL */}
                    <button
                      onClick={irAjustesPerfil}
                      className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-azul-logo transition-colors cursor-pointer"
                    >
                      ⚙️ Configurar Perfil
                    </button>

                    {/* CERRAR SESIÓN */}
                    <div className="border-t border-neutral-200 dark:border-neutral-800 mt-1 pt-1">
                      <button
                        onClick={manejarCerrarSesion}
                        className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      >
                        🚪 Cerrar Sesión
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                onClick={cerrarMenu}
                className={`text-xs font-bold uppercase tracking-widest px-6 py-2.5 transition-all duration-300 ${navbarSolido
                  ? "text-neutral-900 border border-neutral-300 hover:bg-azul-logo hover:text-white hover:border-azul-logo dark:text-white dark:border-white/40"
                  : "text-white border border-white/40 bg-black/20 backdrop-blur-sm hover:bg-azul-logo hover:border-azul-logo"
                  }`}
              >
                Ingresar
              </Link>
            )}

            <div className="hidden md:block">
              <ThemeToggle />
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;