import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import UltimosTrabajos from "../components/UltimosTrabajos";
import SobreMi from "./SobreMi";
import Servicios from "../components/Servicios";
import Contacto from "../components/Contacto";

const Inicio = () => {
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
              bg-center
              bg-no-repeat
            "
            style={{
              backgroundImage:
                "url('/fondo.png')",
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
            <div className="max-w-2xl mt-28 md:mt-0">

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