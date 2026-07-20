const SobreMi = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto w-full" id="sobre-mi">
      
      {/* NUEVO: Título principal de la sección centrado */}
      <div className="text-center mb-16">
        <h3 className="text-white font-bold tracking-[0.2em] uppercase text-xl relative inline-block">
          Sobre Mí
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-azul-logo"></span>
        </h3>
      </div>

      {/* Contenedor principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-neutral-900/40 p-8 md:p-12 lg:p-16 rounded-sm border border-white/5">
        
        {/* Imagen */}
        <div className="relative group overflow-hidden rounded-sm aspect-[4/3] lg:aspect-square shadow-2xl">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: "url('/sobre-mi.png')" }}></div>
          <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-transparent transition-colors duration-500"></div>
        </div>
        
        {/* Textos */}
        <div className="flex flex-col justify-center">
          <h2 className="text-azul-logo font-bold tracking-[0.2em] text-xs md:text-sm uppercase mb-4">Detrás del Lente</h2>
          <h3 className="text-3xl md:text-4xl text-white font-titulos font-bold leading-tight mb-6 uppercase">Capturando la esencia <br/> de cada historia</h3>
          <p className="text-neutral-400 text-sm md:text-base font-textos mb-6 leading-relaxed">
            Soy un fotógrafo apasionado por congelar momentos únicos y convertirlos en recuerdos que perduran para siempre. Mi enfoque se centra en la naturalidad, el manejo de la luz y, sobre todo, en las emociones reales.
          </p>
          <p className="text-neutral-400 text-sm md:text-base font-textos mb-10 leading-relaxed">
            Cada sesión es una oportunidad para contar una historia auténtica, creando un espacio cómodo donde tu verdadera esencia pueda brillar frente a la cámara.
          </p>
          <div>
            <a href="#contacto" className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white border border-white/20 px-8 py-4 hover:border-azul-logo hover:bg-azul-logo transition-all duration-300 group">
              Conocer Más
              <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SobreMi;