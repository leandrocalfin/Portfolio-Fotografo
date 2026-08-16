import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import UltimosTrabajos from "../components/UltimosTrabajos";
import SobreMi from "./SobreMi";
import Servicios from "../components/Servicios";
import Contacto from "../components/Contacto";

const Inicio = () => {
  const [mostrarCarga, setMostrarCarga] = useState(() => {
    return !sessionStorage.getItem("yaVioSplash");
  });

  const [opacidad, setOpacidad] = useState("opacity-100");

  useEffect(() => {
    if (!mostrarCarga) return;

    const temporizadorOpacidad = setTimeout(() => {
      setOpacidad("opacity-0");
    }, 2000);

    const temporizadorBorrado = setTimeout(() => {
      setMostrarCarga(false);
      sessionStorage.setItem("yaVioSplash", "true");
    }, 2700);

    return () => {
      clearTimeout(temporizadorOpacidad);
      clearTimeout(temporizadorBorrado);
    };
  }, [mostrarCarga]);

  return (
    <>
      {/* SPLASH SCREEN */}
      {mostrarCarga && (
        <div
          className={`
            fixed
            inset-0
            z-[9999]
            bg-crema-suave
            dark:bg-neutral-950
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
          <div className="flex items-center justify-center mb-8 animate-pulse">
            <img
              src="/logo2.png"
              alt="Logo MB Fotografía"
              className="h-24 md:h-28 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-azul-logo rounded-full animate-ping" />

            <span className="text-neutral-500 text-xs tracking-[0.4em] uppercase font-bold">
              Ingresando
            </span>
          </div>
        </div>
      )}

      <div className="w-full bg-crema-suave dark:bg-neutral-950 transition-colors duration-300">

        {/* ================= HERO ================= */}
        <section
          id="inicio"
          className="
            relative
            w-full
            min-h-[75vh]
            md:min-h-screen
            flex
            items-center
          "
        >
          {/* IMAGEN DE FONDO - SIN CAMBIOS */}
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
              backgroundImage: "url('/fondo.png')",
            }}
          >
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

          {/* CONTENIDO */}
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
            <div
              className="
                max-w-2xl
                mt-28

                md:mt-0
                md:max-w-xl

                lg:max-w-2xl
              "
            >
              {/* CAPTURANDO */}
              <h2
                className="
                  text-azul-logo
                  font-bold
                  uppercase
                  drop-shadow-sm

                  text-sm
                  tracking-[0.2em]
                  mb-4

                  md:text-xs
                  md:tracking-[0.18em]
                  md:mb-3

                  lg:text-sm
                  lg:tracking-[0.2em]
                  lg:mb-4
                "
              >
                Capturando
              </h2>

              {/* TITULO */}
              <h1
                className="
                  text-white
                  font-titulos
                  font-bold
                  uppercase
                  drop-shadow-md

                  text-5xl
                  leading-tight
                  mb-6

                  md:text-[52px]
                  md:leading-[1]
                  md:mb-5

                  lg:text-7xl
                  lg:leading-tight
                  lg:mb-6
                "
              >
                Momentos
                <br />
                Inolvidables
              </h1>

              {/* DESCRIPCION */}
              <p
                className="
                  text-neutral-200
                  font-textos
                  drop-shadow-sm
                  max-w-lg

                  text-lg
                  mb-10

                  md:text-base
                  md:leading-relaxed
                  md:mb-7
                  md:max-w-md

                  lg:text-xl
                  lg:mb-10
                  lg:max-w-lg
                  lg:text-neutral-300
                "
              >
                Fotografía profesional para contar historias reales y emociones
                auténticas.
              </p>

              {/* BOTON */}
              <Link
                to="/galeria"
                className="
                  inline-flex
                  items-center
                  font-bold
                  uppercase
                  tracking-widest
                  text-white

                  border
                  border-white/30
                  bg-black/30
                  backdrop-blur-sm

                  transition-all
                  duration-300
                  group

                  hover:border-azul-logo
                  hover:bg-azul-logo

                  text-xs
                  gap-4
                  px-8
                  py-4

                  md:text-[10px]
                  md:gap-3
                  md:px-6
                  md:py-3

                  lg:text-xs
                  lg:gap-4
                  lg:px-8
                  lg:py-4
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

        {/* ================= RESTO DEL SITIO ================= */}

        <SobreMi />

        <UltimosTrabajos />

        <Servicios />

        <Contacto />
      </div>
    </>
  );
};

export default Inicio;