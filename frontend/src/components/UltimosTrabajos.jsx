import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

const UltimosTrabajos = () => {
  const [trabajos, setTrabajos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerUltimosTrabajos = async () => {
      try {
        const response = await api.get('/api/trabajos?limite=3');
        const data = response.data;

        setTrabajos(data.trabajos.slice(0, 3));
        setCargando(false);
      } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
        setCargando(false);
      }
    };

    obtenerUltimosTrabajos();
  }, []);

  return (
    <section className="pt-4 pb-16 px-6 max-w-7xl mx-auto w-full transition-colors duration-300" id="ultimos-trabajos">

      <div className="text-center mb-16">
        <h3 className="text-neutral-900 dark:text-white font-bold tracking-[0.2em] uppercase text-xl relative inline-block transition-colors">
          Últimos Trabajos
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-azul-logo"></span>
        </h3>
      </div>

      {cargando ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest animate-pulse">Cargando portafolio...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          {trabajos.map((trabajo) => (
            <Link
              to={`/trabajo/${trabajo._id}`}
              key={trabajo._id}
              className="group relative overflow-hidden bg-neutral-200 dark:bg-neutral-900 aspect-[4/3] cursor-pointer rounded-sm border border-neutral-300 dark:border-white/5 hover:border-azul-logo/50 transition-all duration-500 block"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                style={{ backgroundImage: `url(${trabajo.fotos?.[0]})` }}
              ></div>
              
              {/* GRADIENTE CORREGIDO: Suave en claro (from-black/60) y profundo en oscuro */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="absolute bottom-0 left-0 p-8 w-full transform group-hover:-translate-y-2 transition-transform duration-300 z-10">
                <h4 className="text-white font-bold text-lg tracking-widest uppercase mb-1 drop-shadow-md">{trabajo.titulo}</h4>

                <span className="text-azul-logo text-xs tracking-widest uppercase font-bold drop-shadow-sm">
                  Ver Sesión
                </span>
              </div>
            </Link>
          ))}

        </div>
      )}

      <div className="flex justify-center mt-12">
        <Link to="/galeria" className="text-xs font-bold uppercase tracking-widest text-neutral-800 dark:text-white border border-neutral-300 dark:border-white/20 px-8 py-4 hover:border-azul-logo hover:bg-azul-logo hover:text-white transition-all duration-300">
          Ver Galería Completa
        </Link>
      </div>

    </section>
  );
};

export default UltimosTrabajos;