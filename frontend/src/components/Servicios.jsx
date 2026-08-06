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

        const datos = respuesta.data.servicios || respuesta.data;

        setMisServicios(Array.isArray(datos) ? datos : []);
      } catch (error) {
        console.error("Error al obtener servicios públicos:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerServiciosPublicos();
  }, []);

  const irAlAnterior = () => {
    const swiper = swiperRef.current;

    if (!swiper || swiper.destroyed || swiper.animating) return;

    if (swiper.isBeginning || swiper.activeIndex === 0) {
      swiper.slideTo(misServicios.length - 1, 600);
    } else {
      swiper.slidePrev();
    }
  };

  const irAlSiguiente = () => {
    const swiper = swiperRef.current;

    if (!swiper || swiper.destroyed || swiper.animating) return;

    if (
      swiper.isEnd ||
      swiper.activeIndex >= misServicios.length - 1
    ) {
      swiper.slideTo(0, 600);
    } else {
      swiper.slideNext();
    }
  };

  if (cargando || misServicios.length === 0) {
    return null;
  }

  return (
    <section
      id="servicios"
      className="pt-4 pb-16 px-4 max-w-7xl mx-auto w-full overflow-hidden transition-colors duration-300"
    >
      <div className="text-center mb-16">
        <h3 className="text-neutral-900 dark:text-white font-bold tracking-[0.2em] uppercase text-xl relative inline-block transition-colors">
          Servicios

          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-azul-logo" />
        </h3>
      </div>

      <div className="w-full max-w-5xl mx-auto px-8 md:px-16 relative">
        {/* FLECHA IZQUIERDA */}
        <button
          type="button"
          onClick={irAlAnterior}
          aria-label="Ver servicio anterior"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-neutral-100 dark:bg-[#111111] border border-neutral-300 dark:border-white/5 items-center justify-center cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors hidden md:flex rounded-sm shadow-md"
        >
          <svg
            className="w-6 h-6 text-neutral-800 dark:text-white"
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

        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          loop={false}
          rewind={false}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          slidesPerGroup={1}
          spaceBetween={20}
          speed={600}
          watchOverflow={false}
          coverflowEffect={{
            rotate: 45,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[EffectCoverflow, Pagination]}
          className="w-full py-10"
          style={{
            "--swiper-pagination-color": "#1363DF",
            "--swiper-pagination-bottom": "0px",
          }}
        >
          {misServicios.map((servicio) => (
            <SwiperSlide
              key={servicio._id}
              style={{
                width: "320px",
              }}
            >
              <div className="bg-[#78A4CB]/15 dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-300 dark:border-white/5 hover:border-azul-logo/30 transition-all duration-500 shadow-xl flex flex-col h-[480px] group relative border-t-4 border-t-azul-logo">
                <div className="h-56 w-full relative bg-neutral-200 dark:bg-neutral-900">
                  <img
                    src={servicio.imagen}
                    alt={servicio.titulo}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                  />

                  <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#78A4CB]/20 dark:from-[#151515] to-transparent opacity-90" />
                </div>

                <div className="p-8 flex flex-col flex-grow items-center text-center justify-between relative z-10 min-w-0">
                  <div className="w-full min-w-0">
                    <h4 className="text-[18px] text-neutral-900 dark:text-white font-titulos font-bold mb-4 uppercase transition-colors duration-300 leading-tight break-words">
                      {servicio.titulo}
                    </h4>

                    <p className="text-neutral-700 dark:text-neutral-300 text-[12px] font-textos leading-relaxed transition-colors break-words">
                      {servicio.descripcion}
                    </p>
                  </div>

                  <a
                    href={servicio.link || "#contacto"}
                    className="mt-4 text-[11px] font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-200 border border-neutral-400/50 dark:border-white/20 rounded-full px-8 py-2.5 hover:bg-azul-logo hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 shadow-sm"
                  >
                    Consultar
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* FLECHA DERECHA */}
        <button
          type="button"
          onClick={irAlSiguiente}
          aria-label="Ver siguiente servicio"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-neutral-100 dark:bg-[#111111] border border-neutral-300 dark:border-white/5 items-center justify-center cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors hidden md:flex rounded-sm shadow-md"
        >
          <svg
            className="w-6 h-6 text-neutral-800 dark:text-white"
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
    </section>
  );
};

export default Servicios;