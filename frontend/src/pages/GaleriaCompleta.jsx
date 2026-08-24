import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const GaleriaCompleta = () => {
  const [trabajos, setTrabajos] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estado para saber qué filtro está presionado
  const [filtroActivo, setFiltroActivo] = useState('Todos');

  useEffect(() => {
    
    const obtenerTodosLosTrabajos = async () => {
      try {
        const response = await api.get('/api/trabajos');
        const data = response.data;
        
        setTrabajos(data.trabajos);
        setCargando(false);
      } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
        setCargando(false);
      }
    };

    obtenerTodosLosTrabajos();
  }, []);

  // Extraemos las categorías únicas de la base de datos automáticamente
  const categoriasUnicas = [
    'Todos',
    ...new Set(trabajos.map(trabajo => trabajo.categoria).filter(Boolean))
  ];

  // Filtramos la lista de trabajos según el botón seleccionado
  const trabajosFiltrados = filtroActivo === 'Todos' 
    ? trabajos 
    : trabajos.filter(trabajo => trabajo.categoria === filtroActivo);

  return (
    <div className="w-full min-h-screen bg-crema-suave dark:bg-neutral-950 pt-32 pb-24 px-6 relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12">
          <h2 className="text-azul-logo font-bold tracking-[0.2em] text-xs md:text-sm uppercase mb-4">Portafolio</h2>
          <h1 className="text-4xl md:text-5xl text-neutral-900 dark:text-white font-titulos font-bold leading-tight uppercase relative inline-block transition-colors">
            Galería Completa
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-azul-logo"></span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-8 max-w-2xl mx-auto transition-colors">
            Explora todas mis sesiones fotográficas. Cada imagen captura una historia única y auténtica.
          </p>
        </div>

        {/* Botones de Filtro */}
        {!cargando && categoriasUnicas.length > 1 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categoriasUnicas.map((categoria, index) => (
              <button
                key={index}
                onClick={() => setFiltroActivo(categoria)}
                className={`px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                  filtroActivo === categoria
                    ? 'border-azul-logo bg-azul-logo text-white shadow-[0_0_15px_rgba(19,99,223,0.4)]'
                    : 'border-neutral-300 dark:border-white/20 text-neutral-700 dark:text-neutral-400 hover:border-azul-logo hover:text-neutral-900 dark:hover:text-white bg-crema-azulado dark:bg-transparent'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        )}

        {cargando ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-neutral-600 dark:text-neutral-400 font-bold uppercase tracking-widest animate-pulse">Cargando portafolio completo...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            
            {trabajosFiltrados.map((trabajo) => (
              <Link 
                to={`/trabajo/${trabajo._id}`}
                key={trabajo._id} 
                className="group relative overflow-hidden bg-crema-azulado dark:bg-neutral-900 aspect-[4/3] cursor-pointer rounded-sm border border-neutral-300 dark:border-white/5 hover:border-azul-logo/50 transition-all duration-500 block shadow-md"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                  style={{ backgroundImage: `url(${trabajo.fotos?.[0]})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* CONTENEDOR DE TEXTOS ALINEADO ABAJO */}
                <div className="absolute bottom-0 left-0 p-3 sm:p-8 w-full flex flex-col justify-end">
                  
                  {/* BLOQUE INSEPARABLE: TÍTULO Y BOTÓN */}
                  <div className="flex flex-col">
                    <h3 className="text-white font-bold text-xs sm:text-xl tracking-widest uppercase mb-1 drop-shadow-md">
                      {trabajo.titulo}
                    </h3>
                    <span className="text-azul-logo text-[9px] sm:text-xs tracking-widest uppercase font-bold group-hover:text-white transition-colors flex items-center gap-2">
                      Ver Sesión Completa
                      <span className="transform transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
                    </span>
                  </div>

                  {/* DESCRIPCIÓN: Aparece ABAJO empujando hacia arriba */}
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out">
                    <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <p className="text-neutral-300 text-sm line-clamp-3 mt-4">
                        {trabajo.descripcion || "Explora las capturas exclusivas de esta sesión fotográfica."}
                      </p>
                    </div>
                  </div>

                </div>
              </Link>
            ))}

            {/* Mensaje por si un filtro no tiene fotos */}
            {trabajosFiltrados.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-neutral-500 font-textos">No hay trabajos en esta categoría por el momento.</p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default GaleriaCompleta;