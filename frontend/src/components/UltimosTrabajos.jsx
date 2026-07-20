import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UltimosTrabajos = () => {
  const [trabajos, setTrabajos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerUltimosTrabajos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/trabajos?limite=3');
        const data = await response.json();
        
        setTrabajos(data);
        setCargando(false);
      } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
        setCargando(false);
      }
    };

    obtenerUltimosTrabajos();
  }, []);

  return (
    <section className="pt-4 pb-16 px-6 max-w-7xl mx-auto w-full" id="ultimos-trabajos">
      
      <div className="text-center mb-16">
        <h3 className="text-white font-bold tracking-[0.2em] uppercase text-xl relative inline-block">
          Últimos Trabajos
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-azul-logo"></span>
        </h3>
      </div>

      {cargando ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-neutral-400 font-bold uppercase tracking-widest animate-pulse">Cargando portafolio...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {trabajos.map((trabajo) => (
            /* ACÁ ESTÁ LA MAGIA: Toda la tarjeta es un solo <Link> gigante */
            <Link 
              to={`/trabajo/${trabajo._id}`} 
              key={trabajo._id} 
              className="group relative overflow-hidden bg-neutral-900 aspect-[4/3] cursor-pointer rounded-sm border border-white/5 hover:border-azul-logo/50 transition-all duration-500 block"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                style={{ backgroundImage: `url(${trabajo.fotos?.[0]})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute bottom-0 left-0 p-8 w-full transform group-hover:-translate-y-2 transition-transform duration-300">
                <h4 className="text-white font-bold text-lg tracking-widest uppercase mb-1">{trabajo.titulo}</h4>
                
                {/* Esto ahora es un <span>, no un <Link>, para que no rompa el botón gigante */}
                <span className="text-neutral-400 text-xs tracking-widest uppercase font-bold group-hover:text-azul-logo transition-colors">
                  Ver Sesión
                </span>
              </div>
            </Link>
          ))}

        </div>
      )}

      <div className="flex justify-center mt-12">
        <Link to="/galeria" className="text-xs font-bold uppercase tracking-widest text-white border border-white/20 px-8 py-4 hover:border-azul-logo hover:bg-azul-logo hover:text-white transition-all duration-300">
          Ver Galería Completa
        </Link>
      </div>

    </section>
  );
};

export default UltimosTrabajos;