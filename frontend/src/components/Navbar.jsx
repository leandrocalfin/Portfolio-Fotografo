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
  const [menuAbierto, setMenuAbierto] = useState(false);

  const [usuario, setUsuario] = useState(null);
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();


  const esPaginaInterna = location.pathname !== "/";

  // ==========================================
  // OBTENER DATOS DEL ADMIN
  // ==========================================

  useEffect(() => {
    const obtenerDatosAdmin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUsuario(null);
        return;
      }

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
        console.error("Error al obtener datos del administrador:", error);

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("ultimaActividad");
        }

        setUsuario(null);
      }
    };

    obtenerDatosAdmin();
  }, [location.pathname]);

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

    document.addEventListener("mousedown", cerrarAfuera);

    return () => {
      document.removeEventListener("mousedown", cerrarAfuera);
    };
  }, []);

  // ==========================================
  // DETECTAR SCROLL
  // ==========================================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ==========================================
  // CERRAR MENÚ
  // ==========================================

  const cerrarMenu = () => {
    setMenuAbierto(false);
    setDropdownAbierto(false);
  };

  // ==========================================
  // NAVEGACIÓN PÚBLICA
  // ==========================================

  const scrollToSection = (sectionId) => {
    cerrarMenu();

    if (location.pathname === "/") {
      if (sectionId === "inicio") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return;
      }

      const section =
        document.getElementById(sectionId);

      if (section) {
        const titulo =
          section.querySelector(".text-center") ||
          section;

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

    navigate("/", {
      state: {
        scrollTo: sectionId,
      },
    });
  };

  // ==========================================
  // NAVEGAR A UNA SECCIÓN DEL DASHBOARD
  // ==========================================

  const irSeccionDashboard = (sectionId) => {
    setDropdownAbierto(false);
    cerrarMenu();

    navigate("/dashboard", {
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
    localStorage.removeItem("ultimaActividad");

    setUsuario(null);
    setDropdownAbierto(false);
    cerrarMenu();

    navigate("/");
  };

  // ==========================================
  // ESTADO VISUAL NAVBAR
  // ==========================================

  const navbarSolido =
    scrolled ||
    menuAbierto ||
    esPaginaInterna;

  const linkClasses = `
    text-[11px]
    lg:text-xs
    font-bold
    uppercase
    tracking-[0.10em]
    lg:tracking-[0.15em]
    transition-colors
    duration-300
    relative
    group
    whitespace-nowrap
  `;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        navbarSolido
          ? "bg-crema-suave dark:bg-neutral-950 border-b border-neutral-300/60 dark:border-white/5 shadow-md"
          : "bg-transparent border-transparent pt-3 lg:pt-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-4 lg:px-6">
        <div className="flex justify-between items-center h-20 lg:h-24">

          {/* ================= LOGO ================= */}

          <button
            onClick={() => scrollToSection("inicio")}
            className="
              flex
              items-center
              gap-2
              lg:gap-3
              group
              z-50
              cursor-pointer
              shrink-0
            "
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
              className="
                h-9
                md:h-9
                lg:h-12
                w-auto
                object-contain
                group-hover:scale-105
                transition-transform
                duration-300
              "
            />

            <span
              className={`
                text-base
                md:text-[17px]
                lg:text-2xl
                tracking-[0.14em]
                lg:tracking-widest
                font-bold
                transition-colors
                whitespace-nowrap
                ${
                  navbarSolido
                    ? "text-neutral-900 dark:text-white"
                    : "text-white"
                }
              `}
            >
              FOTOGRAFÍA
            </span>
          </button>

          {/* ================= MOBILE ================= */}

          <div className="flex items-center gap-3 md:hidden z-50">
            <ThemeToggle />

            <button
              className="text-neutral-900 dark:text-white focus:outline-none"
              onClick={() => {
                setMenuAbierto(!menuAbierto);
                setDropdownAbierto(false);
              }}
              aria-label={
                menuAbierto
                  ? "Cerrar menú"
                  : "Abrir menú"
              }
            >
              <svg
                className="w-7 h-7"
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

          {/* ================= NAVEGACIÓN ================= */}

          <div
            className={`
              absolute
              md:static
              top-0
              left-0
              w-full
              md:w-auto
              h-[100dvh]
              md:h-auto

              flex
              flex-col
              md:flex-row

              items-center
              justify-center
              md:justify-end

              gap-7
              md:gap-4
              lg:gap-8

              px-5
              md:px-0

              transition-all
              duration-500
              ease-in-out

              ${
                menuAbierto
                  ? "bg-crema-suave dark:bg-neutral-950 translate-y-0 opacity-100"
                  : "-translate-y-full md:translate-y-0 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto"
              }
            `}
          >

            {/* INICIO */}

            <button
              onClick={() => scrollToSection("inicio")}
              className={`${linkClasses} ${
                navbarSolido
                  ? "text-neutral-900 dark:text-neutral-300 hover:text-azul-logo dark:hover:text-white"
                  : "text-white/90 hover:text-white"
              }`}
            >
              Inicio

              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full" />
            </button>

            {/* SOBRE MI */}

            <button
              onClick={() => scrollToSection("sobre-mi")}
              className={`${linkClasses} ${
                navbarSolido
                  ? "text-neutral-900 dark:text-neutral-300 hover:text-azul-logo dark:hover:text-white"
                  : "text-white/90 hover:text-white"
              }`}
            >
              Sobre Mí

              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full" />
            </button>

            {/* GALERÍA */}

            <Link
              to="/galeria"
              onClick={cerrarMenu}
              className={`${linkClasses} ${
                navbarSolido
                  ? "text-neutral-900 dark:text-neutral-300 hover:text-azul-logo dark:hover:text-white"
                  : "text-white/90 hover:text-white"
              }`}
            >
              Galería

              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full" />
            </Link>

            {/* SERVICIOS */}

            <button
              onClick={() => scrollToSection("servicios")}
              className={`${linkClasses} ${
                navbarSolido
                  ? "text-neutral-900 dark:text-neutral-300 hover:text-azul-logo dark:hover:text-white"
                  : "text-white/90 hover:text-white"
              }`}
            >
              Servicios

              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full" />
            </button>

            {/* CONTACTO */}

            <button
              onClick={() => scrollToSection("contacto")}
              className={`${linkClasses} ${
                navbarSolido
                  ? "text-neutral-900 dark:text-neutral-300 hover:text-azul-logo dark:hover:text-white"
                  : "text-white/90 hover:text-white"
              }`}
            >
              Contacto

              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full" />
            </button>

            {/* ================= ADMINISTRADOR ================= */}

            {usuario ? (
              <div
                className="relative flex justify-center"
                ref={dropdownRef}
              >
                <button
                  onClick={() =>
                    setDropdownAbierto(
                      !dropdownAbierto
                    )
                  }
                  className="
                    w-9
                    h-9
                    lg:w-11
                    lg:h-11
                    rounded-full
                    overflow-hidden
                    border-2
                    border-azul-logo
                    focus:outline-none
                    flex
                    items-center
                    justify-center
                    bg-neutral-200
                    dark:bg-neutral-800
                    cursor-pointer
                    shadow-md
                    hover:scale-105
                    transition-transform
                  "
                >
                  {usuario?.avatar ? (
                    <img
                      src={usuario.avatar}
                      alt="Administrador"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-neutral-800 dark:text-white uppercase">
                      M
                    </span>
                  )}
                </button>

                {/* ================= DROPDOWN ADMIN ================= */}

                {dropdownAbierto && (
                  <div
                    className="
                      absolute

                      top-full
                      left-1/2
                      -translate-x-1/2

                      md:left-auto
                      md:right-0
                      md:translate-x-0

                      mt-3

                      w-[210px]
                      sm:w-[220px]
                      md:w-60
                      lg:w-64

                      max-w-[calc(100vw-32px)]

                      bg-white
                      dark:bg-neutral-900

                      border
                      border-neutral-300/40
                      dark:border-white/10

                      shadow-2xl

                      py-1.5
                      md:py-2

                      z-[100]

                      text-left
                    "
                  >

                    {/* USUARIO */}

                    <div
                      className="
                        px-3
                        md:px-4

                        py-2.5
                        md:py-3

                        border-b
                        border-neutral-200
                        dark:border-neutral-800
                      "
                    >
                      <p
                        className="
                          text-[8px]
                          md:text-[10px]
                          text-neutral-500
                          uppercase
                          tracking-widest
                          font-bold
                        "
                      >
                        Conectado como
                      </p>

                      <p
                        className="
                          text-xs
                          md:text-sm
                          text-neutral-900
                          dark:text-white
                          font-bold
                          mt-1
                          truncate
                        "
                      >
                        Michael Bogue
                      </p>
                    </div>

                    {/* GALERÍA */}

                    <button
                      onClick={() =>
                        irSeccionDashboard(
                          "admin-galeria"
                        )
                      }
                      className="
                        w-full
                        text-left
                        px-3
                        md:px-4
                        py-2.5
                        md:py-3
                        text-[9px]
                        md:text-xs
                        font-bold
                        uppercase
                        tracking-wide
                        md:tracking-wider
                        text-neutral-700
                        dark:text-neutral-300
                        hover:bg-neutral-100
                        dark:hover:bg-neutral-800
                        hover:text-azul-logo
                        transition-colors
                        cursor-pointer
                      "
                    >
                      🖼️ Administrar Galería
                    </button>

                    {/* SERVICIOS */}

                    <button
                      onClick={() =>
                        irSeccionDashboard(
                          "admin-servicios"
                        )
                      }
                      className="
                        w-full
                        text-left
                        px-3
                        md:px-4
                        py-2.5
                        md:py-3
                        text-[9px]
                        md:text-xs
                        font-bold
                        uppercase
                        tracking-wide
                        md:tracking-wider
                        text-neutral-700
                        dark:text-neutral-300
                        hover:bg-neutral-100
                        dark:hover:bg-neutral-800
                        hover:text-azul-logo
                        transition-colors
                        cursor-pointer
                      "
                    >
                      📷 Administrar Servicios
                    </button>

                    {/* PERFIL */}

                    <button
                      onClick={() =>
                        irSeccionDashboard(
                          "ajustes-perfil"
                        )
                      }
                      className="
                        w-full
                        text-left
                        px-3
                        md:px-4
                        py-2.5
                        md:py-3
                        text-[9px]
                        md:text-xs
                        font-bold
                        uppercase
                        tracking-wide
                        md:tracking-wider
                        text-neutral-700
                        dark:text-neutral-300
                        hover:bg-neutral-100
                        dark:hover:bg-neutral-800
                        hover:text-azul-logo
                        transition-colors
                        cursor-pointer
                      "
                    >
                      ⚙️ Configurar Perfil
                    </button>

                    {/* CERRAR SESIÓN */}

                    <div
                      className="
                        border-t
                        border-neutral-200
                        dark:border-neutral-800
                        mt-1
                        pt-1
                      "
                    >
                      <button
                        onClick={
                          manejarCerrarSesion
                        }
                        className="
                          w-full
                          text-left
                          px-3
                          md:px-4
                          py-2.5
                          md:py-3
                          text-[9px]
                          md:text-xs
                          font-bold
                          uppercase
                          tracking-wide
                          md:tracking-wider
                          text-red-600
                          hover:bg-red-50
                          dark:hover:bg-red-950/30
                          transition-colors
                          cursor-pointer
                        "
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
                className={`
                  text-[10px]
                  lg:text-xs
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  lg:tracking-widest
                  px-3
                  lg:px-6
                  py-2
                  lg:py-2.5
                  whitespace-nowrap
                  transition-all
                  duration-300

                  ${
                    navbarSolido
                      ? "text-neutral-900 border border-neutral-300 hover:bg-azul-logo hover:text-white hover:border-azul-logo dark:text-white dark:border-white/40"
                      : "text-white border border-white/40 bg-black/20 backdrop-blur-sm hover:bg-azul-logo hover:border-azul-logo"
                  }
                `}
              >
                Ingresar
              </Link>
            )}

            {/* THEME DESKTOP */}

            <div className="hidden md:block shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;