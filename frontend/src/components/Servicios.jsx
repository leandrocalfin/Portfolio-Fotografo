import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules'; 

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Servicios = () => {
  const misServicios = [
    {
      id: 1,
      titulo: "Eventos",
      descripcion: "Cobertura de tu gran día. Capturando cada lágrima y sonrisa de forma documental y natural.",
      imagen: "/servicios-bodas.jpg", 
      link: "#contacto"
    },
    {
      id: 2,
      titulo: "Retratos",
      descripcion: "Sesiones individuales o parejas. Diseñadas para destacar tu personalidad en un ambiente relajado.",
      imagen: "/servicios-retratos.jpg", 
      link: "#contacto"
    },
    {
      id: 3,
      titulo: "Marcas y Producto",
      descripcion: "Fotografía gastronómica y de producto. Imágenes diseñadas para potenciar tu identidad.",
      imagen: "/servicios-marcas.jpg", 
      link: "#contacto"
    },
    {
      id: 4,
      titulo: "Paisajes",
      descripcion: "Cada paisaje tiene una historia, y nuestra cámara la cuenta. Inmortalizamos momentos naturales con luz, color y detalle, creando imágenes que transmiten tranquilidad y conexión con la naturaleza.",
      imagen: "/servicios-paisajes.png", 
      link: "#contacto"
    }
  ];

  return (
    <section className="pt-4 pb-16 px-4 max-w-7xl mx-auto w-full overflow-hidden transition-colors duration-300" id="servicios">
      
      <div className="text-center mb-16">
        <h3 className="text-neutral-900 dark:text-white font-bold tracking-[0.2em] uppercase text-xl relative inline-block transition-colors">
          Servicios
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-azul-logo"></span>
        </h3>
      </div>

      <div className="w-full max-w-5xl mx-auto px-8 md:px-16 relative">
        
        {/* FLECHA IZQUIERDA */}
        <div className="flecha-anterior absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-neutral-100 dark:bg-[#111111] border border-neutral-300 dark:border-white/5 flex items-center justify-center cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors hidden md:flex rounded-sm shadow-md">
          <svg className="w-6 h-6 text-neutral-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </div>

        <Swiper
          loop={true}
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 45,
            stretch: 0, 
            depth: 200,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{ clickable: true }}
          navigation={{
            nextEl: '.flecha-siguiente',
            prevEl: '.flecha-anterior',
          }}
          modules={[EffectCoverflow, Pagination, Navigation]}
          className="w-full py-10"
          style={{
            '--swiper-pagination-color': '#1363DF',
            '--swiper-pagination-bottom': '0px'
          }}
        >
          {misServicios.map((servicio) => (
            <SwiperSlide 
              key={servicio.id} 
              style={{ width: '320px' }}
            >
              {/* Tarjeta con fondo crema azulado */}
              <div className="bg-crema-azulado dark:bg-[#151515] rounded-xl overflow-hidden border border-neutral-300 dark:border-white/5 hover:border-azul-logo/30 transition-all duration-500 shadow-xl flex flex-col h-[480px] group relative">
                
                {/* Contenedor de la Imagen */}
                <div className="h-56 w-full relative bg-neutral-200 dark:bg-neutral-900">
                  <img 
                    src={servicio.imagen} 
                    alt={servicio.titulo} 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  {/* Gradiente adaptado al fondo crema azulado */}
                  <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-crema-azulado dark:from-[#151515] to-transparent opacity-90"></div>
                </div>

                {/* Contenido (Textos y Botón) */}
                <div className="p-8 flex flex-col flex-grow items-center text-center justify-between relative z-10">
                  <div>
                    <h4 className="text-[18px] text-neutral-900 dark:text-white font-titulos font-bold mb-4 uppercase transition-colors duration-300 leading-tight">
                      {servicio.titulo}
                    </h4>
                    <p className="text-neutral-600 dark:text-neutral-400 text-[12px] font-textos leading-relaxed transition-colors">
                      {servicio.descripcion}
                    </p>
                  </div>
                  
                  <a 
                    href={servicio.link}
                    className="mt-4 text-[11px] font-bold uppercase tracking-widest text-neutral-800 dark:text-neutral-300 border border-neutral-300 dark:border-white/20 rounded-full px-8 py-2.5 hover:bg-azul-logo hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
                  >
                    Consultar
                  </a>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* FLECHA DERECHA */}
        <div className="flecha-siguiente absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-neutral-100 dark:bg-[#111111] border border-neutral-300 dark:border-white/5 flex items-center justify-center cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors hidden md:flex rounded-sm shadow-md">
          <svg className="w-6 h-6 text-neutral-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </div>

      </div>
    </section>
  );
};

export default Servicios;