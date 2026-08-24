import { useState, useEffect } from "react";

import api from "../api/api";

/*
  Texto que se muestra mientras el fotógrafo
  no haya guardado uno propio en el Dashboard.
*/
const TEXTOS_POR_DEFECTO = [
  "Soy un fotógrafo apasionado por congelar momentos únicos y convertirlos en recuerdos que perduran para siempre. Mi enfoque se centra en la naturalidad, el manejo de la luz y, sobre todo, en las emociones reales.",
  "Cada sesión es una oportunidad para contar una historia auténtica, creando un espacio cómodo donde tu verdadera esencia pueda brillar frente a la cámara."
];

const TITULO_POR_DEFECTO = ["Capturando la esencia", "de cada historia"];

const IMAGEN_POR_DEFECTO = "/sobre-mi.png";

const SobreMi = () => {
  // Contenido editable desde el Dashboard.
  // Vacío -> se usa el contenido por defecto.
  const [tituloSobreMi, setTituloSobreMi] = useState("");
  const [textoSobreMi, setTextoSobreMi] = useState("");
  const [fotoSobreMi, setFotoSobreMi] = useState("");

  useEffect(() => {
    const cargarContenido = async () => {
      try {
        const respuesta = await api.get(
          "/api/usuarios/perfil-publico"
        );
        setTituloSobreMi(respuesta.data.tituloSobreMi || "");
        setTextoSobreMi(respuesta.data.textoSobreMi || "");
        setFotoSobreMi(respuesta.data.fotoSobreMi || "");
      } catch {
        // Si falla, quedan los contenidos por defecto.
        setTituloSobreMi("");
        setTextoSobreMi("");
        setFotoSobreMi("");
      }
    };

    cargarContenido();
  }, []);

  /*
    Los párrafos se separan por líneas vacías
    (doble salto de línea), igual que en el
    textarea del Dashboard.
  */
  const parrafos = textoSobreMi.trim()
    ? textoSobreMi
        .split(/\n\s*\n/)
        .map((parrafo) => parrafo.trim())
        .filter(Boolean)
    : TEXTOS_POR_DEFECTO;

  return (
    <section
      id="sobre-mi"
      className="
        relative
        py-16
        px-4
        max-w-7xl
        mx-auto
        w-full
        overflow-hidden
        transition-colors
        duration-300

        sm:px-6
        sm:py-24

        md:py-28
      "
    >
      {/* TÍTULO */}

      <div className="relative text-center mb-12 lg:mb-20">
        <h3
          className="
            text-neutral-900
            dark:text-white
            font-bold
            tracking-[0.2em]
            uppercase

            text-lg
            md:text-lg
            lg:text-xl

            relative
            inline-block
            transition-colors
          "
        >
          Sobre Mí

          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-azul-logo" />
        </h3>
      </div>

      {/* TEXTO FANTASMA DE FONDO */}

      <span
        aria-hidden="true"
        className="
          pointer-events-none
          select-none
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          font-titulos
          font-bold
          uppercase
          whitespace-nowrap
          leading-none

          text-[18vw]
          text-neutral-900/[0.04]
          dark:text-white/[0.03]
        "
      >
        Sobre Mí
      </span>

      {/* CRUCES DECORATIVAS */}

      <svg
        aria-hidden="true"
        className="
          hidden
          md:block
          absolute
          top-12
          right-8
          w-6
          h-6
          text-azul-logo/40
          dark:text-azul-logo/30
        "
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeWidth="2" d="M12 5v14M5 12h14" />
      </svg>

      <svg
        aria-hidden="true"
        className="
          hidden
          md:block
          absolute
          bottom-12
          left-8
          w-6
          h-6
          text-azul-logo/40
          dark:text-azul-logo/30
        "
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeWidth="2" d="M12 5v14M5 12h14" />
      </svg>

      {/* CONTENEDOR PRINCIPAL */}

      <div
        className="
          relative
          grid
          grid-cols-1
          gap-16

          lg:grid-cols-[5fr_6fr]
          lg:gap-20
          items-center
        "
      >
        {/* IMAGEN CON MARCO DESPLAZADO */}

        <div className="group relative w-full max-w-[195px] mx-auto sm:max-w-xs lg:max-w-none">
          {/* Marco desplazado detrás de la foto */}

          <div
            aria-hidden="true"
            className="
              absolute
              inset-0
              translate-x-4
              translate-y-4
              border-2
              border-azul-logo
              rounded-sm
              transition-transform
              duration-500

              group-hover:translate-x-2
              group-hover:translate-y-2
            "
          />

          {/* Foto */}

          <div
            className="
              relative
              overflow-hidden
              rounded-sm

              aspect-[4/5]

              shadow-2xl
              bg-neutral-200
              dark:bg-neutral-800
            "
          >
            <div
              className="
                absolute
                inset-0
                bg-cover
                bg-center
                transition-transform
                duration-[1500ms]

                group-hover:scale-105
              "
              style={{
                backgroundImage:
                  `url('${fotoSobreMi || IMAGEN_POR_DEFECTO}')`,
              }}
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-neutral-950/40
                via-transparent
                to-transparent
              "
            />
          </div>

          {/* SELLO GIRATORIO MB */}

          <div
            className="
              absolute
              -bottom-8
              right-6
              md:right-10

              w-16
              h-16
              md:w-28
              md:h-28

              rounded-full
              bg-white/20
              backdrop-blur-sm
              border-2
              border-azul-logo
              shadow-2xl

              flex
              flex-col
              items-center
              justify-center

              rotate-[-8deg]
              group-hover:rotate-0
              transition-transform
              duration-500
              z-10
            "
          >
            <img
              src="/logo.png"
              alt="Logo MB Fotografía"
              className="
                block
                dark:hidden
                w-11
                h-11
                md:w-20
                md:h-20
                object-contain
              "
            />

            <img
              src="/logo2.png"
              alt="Logo MB Fotografía"
              className="
                hidden
                dark:block
                w-11
                h-11
                md:w-20
                md:h-20
                object-contain
              "
            />
          </div>
        </div>

        {/* TEXTOS */}

        <div className="flex flex-col justify-center">
          {/* KICKER */}

          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-px bg-azul-logo shrink-0" />

            <h2
              className="
                text-azul-logo
                font-bold
                tracking-[0.25em]
                uppercase
                text-[10px]
                sm:text-xs
              "
            >
              Detrás del Lente... Michael Bogue
            </h2>
          </div>

          {/* TÍTULO */}

          <h3
            className="
              text-neutral-900
              dark:text-white
              font-titulos
              font-bold
              uppercase
              transition-colors

              text-3xl
              leading-tight
              mb-6

              sm:text-4xl

              lg:text-5xl
              lg:leading-[1.05]
              lg:mb-8
            "
          >
            {tituloSobreMi.trim()
              ? tituloSobreMi
              : TITULO_POR_DEFECTO.map((linea, indice) => (
                  <span key={indice}>
                    {linea}
                    {indice < TITULO_POR_DEFECTO.length - 1 && <br />}
                  </span>
                ))}
          </h3>

          {/* PÁRRAFOS */}

          {parrafos.map((parrafo, indice) => (
            <p
              key={indice}
              className={`
                text-neutral-700
                dark:text-neutral-300
                font-textos
                transition-colors

                text-xs
                leading-relaxed
                text-justify

                sm:text-sm

                md:text-[13px]
                md:leading-6

                lg:text-base
                lg:leading-relaxed

                ${
                  indice === parrafos.length - 1
                    ? "mb-8"
                    : "mb-4 md:mb-4 lg:mb-6"
                }

                ${
                  indice === 0
                    ? "first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-titulos first-letter:font-bold first-letter:text-azul-logo first-letter:leading-[0.85]"
                    : ""
                }
              `}
            >
              {parrafo}
            </p>
          ))}

          {/* DIVISOR Y BOTÓN */}

          <div className="w-full h-px bg-gradient-to-r from-azul-logo/60 to-transparent mb-8" />

          <div>
            <a
              href="#contacto"
              className="
                inline-flex
                items-center

                text-neutral-900
                dark:text-white

                font-bold
                uppercase
                tracking-widest

                border
                border-neutral-400/50
                dark:border-white/20

                transition-all
                duration-300

                hover:border-azul-logo
                hover:bg-azul-logo
                hover:text-white

                group
                shadow-md

                text-[10px]
                gap-2
                px-5
                py-3

                md:text-[10px]
                md:px-5
                md:py-3

                lg:text-xs
                lg:gap-4
                lg:px-8
                lg:py-4
              "
            >
              Hablemos

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
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SobreMi;
