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
        py-16
        px-4
        max-w-7xl
        mx-auto
        w-full
        transition-colors
        duration-300

        sm:px-6
        sm:py-20

        md:py-16

        lg:py-24
      "
    >
      {/* TÍTULO */}
      <div className="text-center mb-10 md:mb-10 lg:mb-16">
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

      {/* CONTENEDOR PRINCIPAL */}
      <div
        className="
          grid
          grid-cols-1
          gap-8
          items-center

          bg-[#78A4CB]/15
          dark:bg-neutral-900

          p-5
          sm:p-7

          md:grid-cols-2
          md:gap-8
          md:p-7

          lg:gap-12
          lg:p-16

          rounded-sm
          shadow-xl
          border-t-4
          border-t-azul-logo
          transition-colors
        "
      >
        {/* IMAGEN */}
        <div
          className="
            relative
            group
            overflow-hidden
            rounded-sm

            aspect-[4/3]

            md:aspect-[4/3]

            lg:aspect-square

            shadow-2xl
            bg-neutral-200
            dark:bg-neutral-900
            border
            border-azul-logo/20
          "
        >
          <div
            className="
              absolute
              inset-0
              bg-cover
              bg-center
              transition-transform
              duration-1000
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
              bg-black/10
              dark:bg-neutral-950/20
              group-hover:bg-transparent
              transition-colors
              duration-500
            "
          />
        </div>

        {/* TEXTOS */}
        <div className="flex flex-col justify-center">
          <h2
            className="
              text-azul-logo
              font-bold
              tracking-[0.2em]
              uppercase

              text-[10px]
              mb-3

              sm:text-xs

              md:text-[11px]
              md:mb-3

              lg:text-sm
              lg:mb-4
            "
          >
            Detrás del Lente... Michael Bogue
          </h2>

          <h3
            className="
              text-neutral-900
              dark:text-white
              font-titulos
              font-bold
              uppercase
              transition-colors

              text-2xl
              leading-tight
              mb-4

              sm:text-3xl

              md:text-[28px]
              md:leading-[1.05]
              md:mb-4

              lg:text-4xl
              lg:leading-tight
              lg:mb-6
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
                    ? "mb-6 md:mb-6 lg:mb-10"
                    : "mb-4 md:mb-4 lg:mb-6"
                }
              `}
            >
              {parrafo}
            </p>
          ))}

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