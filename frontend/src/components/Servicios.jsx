const Servicios = () => {
  return (
    <section className="pt-4 pb-16 px-6 max-w-7xl mx-auto w-full" id="servicios">
      <div className="text-center mb-16">
        <h3 className="text-white font-bold tracking-[0.2em] uppercase text-xl relative inline-block">
          Servicios
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-azul-logo"></span>
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Servicio 1 */}
        <div className="bg-neutral-900/40 p-10 border border-white/5 hover:border-azul-logo/50 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-azul-logo transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          <h4 className="text-xl text-white font-titulos font-bold mb-4 uppercase group-hover:text-azul-logo transition-colors duration-300">Bodas y Eventos</h4>
          <p className="text-neutral-400 text-sm font-textos mb-10 leading-relaxed">Cobertura completa de tu gran día. Desde los preparativos hasta la fiesta, capturando cada lágrima y sonrisa de forma documental, natural y artística.</p>
          <a href="#contacto" className="text-xs font-bold uppercase tracking-widest text-azul-logo flex items-center gap-2 group-hover:gap-4 transition-all duration-300">Consultar <span className="text-lg">→</span></a>
        </div>
        {/* Servicio 2 */}
        <div className="bg-neutral-900/40 p-10 border border-white/5 hover:border-azul-logo/50 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-azul-logo transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          <h4 className="text-xl text-white font-titulos font-bold mb-4 uppercase group-hover:text-azul-logo transition-colors duration-300">Retratos y Books</h4>
          <p className="text-neutral-400 text-sm font-textos mb-10 leading-relaxed">Sesiones individuales, parejas o familias. En estudio o exteriores. Diseñadas para destacar tu personalidad en un ambiente relajado y profesional.</p>
          <a href="#contacto" className="text-xs font-bold uppercase tracking-widest text-azul-logo flex items-center gap-2 group-hover:gap-4 transition-all duration-300">Consultar <span className="text-lg">→</span></a>
        </div>
        {/* Servicio 3 */}
        <div className="bg-neutral-900/40 p-10 border border-white/5 hover:border-azul-logo/50 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-azul-logo transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          <h4 className="text-xl text-white font-titulos font-bold mb-4 uppercase group-hover:text-azul-logo transition-colors duration-300">Marcas y Producto</h4>
          <p className="text-neutral-400 text-sm font-textos mb-10 leading-relaxed">Fotografía gastronómica, corporativa y de producto. Imágenes de alto impacto visual diseñadas específicamente para potenciar la identidad de tu empresa.</p>
          <a href="#contacto" className="text-xs font-bold uppercase tracking-widest text-azul-logo flex items-center gap-2 group-hover:gap-4 transition-all duration-300">Consultar <span className="text-lg">→</span></a>
        </div>
      </div>
    </section>
  );
};

export default Servicios;