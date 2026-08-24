import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import api from "../api/api";
import UltimosTrabajos from "../components/UltimosTrabajos";
import SobreMi from "./SobreMi";
import Servicios from "../components/Servicios";
import Contacto from "../components/Contacto";

// ==========================================
// DATOS FIJOS DEL SITIO
// ==========================================

const UBICACION = "Río Gallegos, Santa Cruz";

const Inicio = () => {
  // ==========================================
  // PORTADA PERSONALIZADA
  // ==========================================

  const [portada, setPortada] = useState("");

  useEffect(() => {
    const cargarPortada = async () => {
      try {
        // Si falla, simplemente se usa la imagen por defecto.
        const respuesta = await api.get("/api/usuarios/perfil-publico");
        setPortada(respuesta.data.fotoPortada || "");
      } catch {
        setPortada("");
      }
    };

    cargarPortada();
  }, []);

  // ==========================================
  // SPLASH SCREEN
  // ==========================================

  const [mostrarCarga, setMostrarCarga] = useState(() => {
    return !sessionStorage.getItem("yaVioSplash");
  });

  const [opacidad, setOpacidad] = useState("opacity-100");

  useEffect(() => {
    if (!mostrarCarga) return;

    // A los 2 segundos empieza a desaparecer.
    const temporizadorOpacidad = setTimeout(() => {
      setOpacidad("opacity-0");
    }, 2000);

    // A los 2.7 segundos se elimina completamente.
    const temporizadorBorrado = setTimeout(() => {
      setMostrarCarga(false);

      sessionStorage.setItem(
        "yaVioSplash",
        "true"
      );
    }, 2700);

    return () => {
      clearTimeout(temporizadorOpacidad);
      clearTimeout(temporizadorBorrado);
    };
  }, [mostrarCarga]);

  return (
    <>
      {/* ==========================================
          SPLASH SCREEN
          SIEMPRE EN MODO OSCURO
      ========================================== */}

      {mostrarCarga && (
        <div
          className={`
            fixed
            inset-0
            z-[9999]
            bg-neutral-950
            flex
            flex-col
            items-center
            justify-center
            transition-opacity
            duration-700
            ease-in-out
            ${opacidad}
          `}
        >
          {/* LOGO */}

          <div className="flex items-center justify-center mb-8 animate-pulse">
            <img
              src="/logo2.png"
              alt="Logo MB Fotografía"
              className="
                h-24
                md:h-28
                w-auto
                object-contain
              "
            />
          </div>

          {/* TEXTO INGRESANDO */}

          <div className="flex items-center gap-3">
            <div
              className="
                w-1.5
                h-1.5
                bg-azul-logo
                rounded-full
                animate-ping
              "
            />

            <span
              className="
                text-neutral-400
                text-xs
                tracking-[0.4em]
                uppercase
                font-bold
              "
            >
              Ingresando
            </span>
          </div>
        </div>
      )}

      {/* ==========================================
          CONTENIDO PRINCIPAL
      ========================================== */}

      <div
        className="
          w-full
          bg-crema-suave
          dark:bg-neutral-950
          transition-colors
          duration-300
        "
      >
        {/* ==========================================
            HERO / INICIO
        ========================================== */}

        <section
          className="
            relative
            w-full
            min-h-[75vh]
            md:min-h-screen
            flex
            items-center
          "
          id="inicio"
        >
          {/* IMAGEN DE FONDO */}

          <div
            className="
              absolute
              inset-0
              z-0
              bg-cover
              bg-no-repeat
              [background-position:center_30%]
              md:bg-center
            "
            style={{
              backgroundImage:
                `url('${portada || "/fondo.png"}')`,
            }}
          >
            {/* OSCURECIMIENTO */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                md:bg-gradient-to-r
                from-black/70
                via-black/40
                md:from-black/80
                md:via-black/30
                to-transparent
              "
            />
          </div>

          {/* CONTENIDO HERO */}

          <div
            className="
              relative
              z-10
              max-w-7xl
              mx-auto
              px-6
              w-full
            "
          >
            <div className="max-w-2xl mt-28 mb-16 md:mt-0 md:mb-0">

              {/* SUBTÍTULO */}

              <h2
                className="
                  text-azul-logo
                  font-bold
                  tracking-[0.2em]
                  text-sm
                  uppercase
                  mb-4
                  drop-shadow-sm
                "
              >
                Capturando
              </h2>

              {/* TÍTULO */}

              <h1
                className="
                  text-5xl
                  md:text-7xl
                  text-white
                  font-titulos
                  font-bold
                  leading-tight
                  mb-6
                  uppercase
                  drop-shadow-md
                "
              >
                Momentos
                <br />
                Inolvidables
              </h1>

              {/* UBICACIÓN */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mb-7
                "
              >
                <svg
                  className="w-5 h-5 text-azul-logo shrink-0 drop-shadow-md"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

                <span
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-white
                    drop-shadow-md
                  "
                >
                  {UBICACION}
                </span>
              </div>

              {/* DESCRIPCIÓN */}

              <p
                className="
                  text-neutral-200
                  md:text-neutral-300
                  text-lg
                  md:text-xl
                  font-textos
                  mb-10
                  max-w-lg
                  drop-shadow-sm
                "
              >
                Fotografía profesional para contar
                historias reales y emociones
                auténticas.
              </p>

              {/* BOTÓN GALERÍA */}

              <Link
                to="/galeria"
                className="
                  inline-flex
                  items-center
                  gap-4
                  text-xs
                  font-bold
                  uppercase
                  tracking-widest
                  text-white
                  border
                  border-white/30
                  bg-black/30
                  backdrop-blur-sm
                  px-8
                  py-4
                  hover:border-azul-logo
                  hover:bg-azul-logo
                  transition-all
                  duration-300
                  group
                "
              >
                Ver Galería

                <svg
                  className="
                    w-4
                    h-4
                    transform
                    group-hover:translate-x-2
                    transition-transform
                    duration-300
                  "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                  </svg>
                </Link>
            </div>
          </div>
        </section>

        {/* ==========================================
            RESTO DE LAS SECCIONES
        ========================================== */}

        <SobreMi />

        <UltimosTrabajos />

        <Servicios />

        <Contacto />
      </div>
    </>
  );
};

export default Inicio;