import { useState, useEffect, useRef } from "react";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const Servicios = () => {
  const [misServicios, setMisServicios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const swiperRef = useRef(null);

  useEffect(() => {
    const obtenerServiciosPublicos = async () => {
      try {
        const respuesta = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/servicios`
        );

        const datos =
          respuesta.data.servicios || respuesta.data;

        setMisServicios(
          Array.isArray(datos) ? datos : []
        );
      } catch (error) {
        console.error(
          "Error al obtener servicios públicos:",
          error
        );
      } finally {
        setCargando(false);
      }
    };

    obtenerServiciosPublicos();
  }, []);

  // ==============================
  // NAVEGACION DEL CARRUSEL
  // ==============================

  const irAlAnterior = () => {
    const swiper = swiperRef.current;

    if (!swiper || swiper.destroyed) return;

    swiper.slidePrev();
  };

  const irAlSiguiente = () => {
    const swiper = swiperRef.current;

    if (!swiper || swiper.destroyed) return;

    swiper.slideNext();
  };

  return (
    <section
      id="servicios"
      data-cargando={cargando ? "true" : "false"}
      className="
        pt-4
        pb-12
        px-4
        max-w-7xl
        mx-auto
        w-full
        overflow-hidden
        transition-colors
        duration-300
        min-h-[560px]

        md:min-h-[580px]
        md:pb-14

        lg:min-h-[650px]
        lg:pb-16
      "
    >
      {/* TITULO */}
      <div className="text-center mb-10 md:mb-12 lg:mb-16">
        <h3
          className="
            text-neutral-900
            dark:text-white
            font-bold
            tracking-[0.2em]
            uppercase
            text-lg
            md:text-xl
            relative
            inline-block
            transition-colors
          "
        >
          Servicios

          <span
            className="
              absolute
              -bottom-4
              left-1/2
              -translate-x-1/2
              w-12
              h-1
              bg-azul-logo
            "
          />
        </h3>
      </div>

      {/* CARGANDO */}
      {cargando ? (
        <div
          className="
            h-[420px]
            md:h-[450px]
            lg:h-[500px]
            flex
            items-center
            justify-center
          "
        >
          <p
            className="
              text-neutral-500
              text-xs
              font-bold
              uppercase
              tracking-widest
              animate-pulse
            "
          >
            Cargando servicios...
          </p>
        </div>
      ) : misServicios.length === 0 ? (
        <div
          className="
            h-[420px]
            md:h-[450px]
            lg:h-[500px]
            flex
            items-center
            justify-center
          "
        >
          <p className="text-neutral-500 text-sm">
            No hay servicios disponibles.
          </p>
        </div>
      ) : (
        <div
          className="
            w-full
            max-w-5xl
            mx-auto
            px-4
            sm:px-8
            md:px-14
            lg:px-16
            relative
          "
        >
          {/* ========================= */}
          {/* FLECHA IZQUIERDA */}
          {/* ========================= */}

          <button
            type="button"
            onClick={irAlAnterior}
            aria-label="Ver servicio anterior"
            className="
              absolute
              left-0
              top-1/2
              -translate-y-1/2
              z-20

              w-10
              h-10

              lg:w-12
              lg:h-12

              bg-neutral-100
              dark:bg-[#111111]

              border
              border-neutral-300
              dark:border-white/5

              items-center
              justify-center

              cursor-pointer

              hover:bg-neutral-200
              dark:hover:bg-neutral-800

              transition-colors

              hidden
              md:flex

              rounded-sm
              shadow-md
            "
          >
            <svg
              className="
                w-5
                h-5
                lg:w-6
                lg:h-6
                text-neutral-800
                dark:text-white
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* ========================= */}
          {/* SWIPER */}
          {/* ========================= */}

          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}

            loop={false}
            rewind={true}

            // Inicia el carrusel en un servicio del medio
            // para que visualmente haya tarjetas a ambos lados.
            initialSlide={Math.floor(misServicios.length / 2)}

            effect="coverflow"

            grabCursor={true}
            centeredSlides={true}

            slidesPerView="auto"
            slidesPerGroup={1}

            spaceBetween={16}

            speed={600}

            watchOverflow={false}

            coverflowEffect={{
              rotate: 35,
              stretch: 0,
              depth: 160,
              modifier: 1,
              slideShadows: true,
            }}

            pagination={{
              clickable: true,
            }}

            modules={[
              EffectCoverflow,
              Pagination,
            ]}

            className="
              w-full
              py-8
              md:py-9
              lg:py-10
            "

            style={{
              "--swiper-pagination-color":
                "#1363DF",
              "--swiper-pagination-bottom":
                "0px",
            }}
          >
            {misServicios.map((servicio) => (
              <SwiperSlide
                key={servicio._id}
                className="
                  !w-[260px]

                  sm:!w-[280px]

                  md:!w-[270px]

                  lg:!w-[320px]
                "
              >
                {/* CARD */}
                <div
                  className="
                    bg-[#78A4CB]/15
                    dark:bg-neutral-900

                    rounded-xl
                    overflow-hidden

                    border
                    border-neutral-300
                    dark:border-white/5

                    hover:border-azul-logo/30

                    transition-all
                    duration-500

                    shadow-xl

                    flex
                    flex-col

                    h-[400px]

                    sm:h-[420px]

                    md:h-[410px]

                    lg:h-[480px]

                    group
                    relative

                    border-t-4
                    border-t-azul-logo
                  "
                >
                  {/* IMAGEN */}
                  <div
                    className="
                      h-44

                      sm:h-48

                      md:h-44

                      lg:h-56

                      w-full
                      relative

                      bg-neutral-200
                      dark:bg-neutral-900
                    "
                  >
                    <img
                      src={servicio.imagen}
                      alt={servicio.titulo}
                      className="
                        w-full
                        h-full
                        object-cover

                        opacity-90

                        group-hover:opacity-100

                        transition-opacity
                        duration-500
                      "
                    />

                    <div
                      className="
                        absolute
                        bottom-0
                        left-0

                        w-full
                        h-1/3

                        bg-gradient-to-t
                        from-[#78A4CB]/20
                        dark:from-[#151515]
                        to-transparent

                        opacity-90
                      "
                    />
                  </div>

                  {/* CONTENIDO */}
                  <div
                    className="
                      p-5

                      sm:p-6

                      md:p-5

                      lg:p-8

                      flex
                      flex-col
                      flex-grow

                      items-center
                      text-center
                      justify-between

                      relative
                      z-10

                      min-w-0
                    "
                  >
                    <div className="w-full min-w-0">
                      <h4
                        className="
                          text-[15px]

                          sm:text-[16px]

                          md:text-[15px]

                          lg:text-[18px]

                          text-neutral-900
                          dark:text-white

                          font-titulos
                          font-bold

                          mb-3

                          lg:mb-4

                          uppercase

                          transition-colors
                          duration-300

                          leading-tight
                          break-words
                        "
                      >
                        {servicio.titulo}
                      </h4>

                      <p
                        className="
                          text-neutral-700
                          dark:text-neutral-300

                          text-[11px]

                          lg:text-[12px]

                          font-textos
                          leading-relaxed

                          transition-colors

                          break-words
                        "
                      >
                        {servicio.descripcion}
                      </p>
                    </div>

                    {/* BOTON CONSULTAR */}
                    <a
                      href={
                        servicio.link ||
                        "#contacto"
                      }
                      className="
                        mt-3

                        lg:mt-4

                        text-[10px]

                        lg:text-[11px]

                        font-bold
                        uppercase
                        tracking-widest

                        text-neutral-900
                        dark:text-neutral-200

                        border
                        border-neutral-400/50
                        dark:border-white/20

                        rounded-full

                        px-6

                        lg:px-8

                        py-2

                        lg:py-2.5

                        hover:bg-azul-logo
                        hover:text-white

                        dark:hover:bg-white
                        dark:hover:text-black

                        transition-all
                        duration-300

                        shadow-sm
                      "
                    >
                      Consultar
                    </a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ========================= */}
          {/* FLECHA DERECHA */}
          {/* ========================= */}

          <button
            type="button"
            onClick={irAlSiguiente}
            aria-label="Ver siguiente servicio"
            className="
              absolute
              right-0
              top-1/2
              -translate-y-1/2
              z-20

              w-10
              h-10

              lg:w-12
              lg:h-12

              bg-neutral-100
              dark:bg-[#111111]

              border
              border-neutral-300
              dark:border-white/5

              items-center
              justify-center

              cursor-pointer

              hover:bg-neutral-200
              dark:hover:bg-neutral-800

              transition-colors

              hidden
              md:flex

              rounded-sm
              shadow-md
            "
          >
            <svg
              className="
                w-5
                h-5
                lg:w-6
                lg:h-6
                text-neutral-800
                dark:text-white
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default Servicios;