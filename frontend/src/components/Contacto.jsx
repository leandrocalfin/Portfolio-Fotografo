const Contacto = () => {
  return (
    <section className="pt-4 pb-16 px-6 max-w-7xl mx-auto w-full transition-colors duration-300" id="contacto">
      <div className="text-center mb-16">
        <h3 className="text-neutral-900 dark:text-white font-bold tracking-[0.2em] uppercase text-xl relative inline-block transition-colors">
          Contacto
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-azul-logo"></span>
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-8 max-w-lg mx-auto font-textos transition-colors">
          ¿Tienes un proyecto en mente o un evento próximo? Escríbeme y empecemos a planificar cómo capturar tu historia.
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-neutral-100 dark:bg-neutral-900/40 p-8 md:p-12 border border-neutral-200 dark:border-white/5 relative overflow-hidden group transition-colors">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-azul-logo/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <form className="flex flex-col gap-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <label htmlFor="nombre" className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-500 ml-1">Nombre</label>
              <input type="text" id="nombre" className="bg-white dark:bg-neutral-950 border-b border-neutral-300 dark:border-white/10 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-azul-logo transition-colors duration-300 font-textos text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-700" placeholder="Tu nombre completo" />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-500 ml-1">Email</label>
              <input type="email" id="email" className="bg-white dark:bg-neutral-950 border-b border-neutral-300 dark:border-white/10 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-azul-logo transition-colors duration-300 font-textos text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-700" placeholder="tu@email.com" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="mensaje" className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-500 ml-1">Mensaje</label>
            <textarea id="mensaje" rows="4" className="bg-white dark:bg-neutral-950 border-b border-neutral-300 dark:border-white/10 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-azul-logo transition-colors duration-300 font-textos text-sm resize-none placeholder:text-neutral-400 dark:placeholder:text-neutral-700" placeholder="Cuéntame sobre tu sesión ideal, fecha y ubicación..."></textarea>
          </div>
          <div className="flex justify-center mt-4">
            <button type="button" className="text-xs font-bold uppercase tracking-widest text-white border border-azul-logo bg-azul-logo px-10 py-4 hover:bg-transparent hover:text-azul-logo transition-all duration-300 w-full md:w-auto cursor-pointer">
              Enviar Mensaje
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contacto;