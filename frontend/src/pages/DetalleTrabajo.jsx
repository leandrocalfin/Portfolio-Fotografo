import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DetalleTrabajo = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); // <-- Agregamos esto para volver hacia atrás
  const [trabajo, setTrabajo] = useState(null);
  const [cargando, setCargando] = useState(true);

  // ESTADO PARA EL VISOR DE FOTOS (Lightbox)
  const [fotoIndex, setFotoIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0); // Que siempre empiece arriba
    const obtenerDetalle = async () => {
      try {
        const respuesta = await axios.get(`${import.meta.env.VITE_API_URL}/api/trabajos/${id}`);
        setTrabajo(respuesta.data);
        setCargando(false);
      } catch (error) {
        console.error("Error al cargar el trabajo:", error);
        setCargando(false);
      }
    };

    obtenerDetalle();
  }, [id]);

  // ====== FUNCIONES DEL VISOR DE IMÁGENES ======
  const abrirFoto = (index) => setFotoIndex(index);
  const cerrarFoto = () => setFotoIndex(null);

  const fotoAnterior = (e) => {
    e.stopPropagation(); // Evita cerrar el visor al clickear la flecha
    setFotoIndex((prev) => (prev === 0 ? trabajo.fotos.length - 1 : prev - 1));
  };

  const fotoSiguiente = (e) => {
    e.stopPropagation();
    setFotoIndex((prev) => (prev === trabajo.fotos.length - 1 ? 0 : prev + 1));
  };
  // =============================================

  if (cargando) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-azul-logo text-sm font-bold uppercase tracking-widest animate-pulse">
          Abriendo álbum...
        </div>
      </div>
    );
  }

  if (!trabajo) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl font-titulos font-bold uppercase mb-4">Álbum no encontrado</h2>
        <Link to="/" className="text-azul-logo text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-24 px-6 relative">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabecera del Álbum */}
        <div className="mb-16 border-b border-white/10 pb-12 text-center">
          <span className="text-azul-logo text-xs tracking-[0.2em] uppercase font-bold mb-4 block">
            {trabajo.categoria || "Sesión Fotográfica"}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-titulos font-bold text-white mb-6 uppercase inline-block relative">
            {trabajo.titulo}
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-azul-logo"></span>
          </h1>
          <p className="text-neutral-400 text-base md:text-lg leading-relaxed font-textos max-w-3xl mx-auto mt-8">
            {trabajo.descripcion}
          </p>

          {/* Botón del Link de Drive */}
          {trabajo.linkDrive && (
            <div className="mt-10">
              <a 
                href={trabajo.linkDrive} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block text-xs font-bold uppercase tracking-widest text-white border border-azul-logo bg-azul-logo px-10 py-4 hover:bg-transparent hover:text-azul-logo transition-all duration-300"
              >
                Ver Álbum Completo en Drive
              </a>
            </div>
          )}
        </div>

        {/* Grilla con las fotos (ahora son clickeables) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trabajo.fotos && trabajo.fotos.map((foto, index) => (
            <div 
              key={index} 
              onClick={() => abrirFoto(index)} // Abre la foto grande
              className={`group overflow-hidden bg-neutral-900 border border-white/5 rounded-sm relative cursor-pointer ${index === 0 ? 'md:col-span-2 aspect-video' : 'aspect-[4/3]'}`}
            >
              <img 
                src={foto} 
                alt={`${trabajo.titulo} - Foto ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-neutral-950/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
              
              {/* Ícono de Lupa (Aparece sutilmente al hacer hover) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="bg-black/50 text-white rounded-full p-4 backdrop-blur-sm shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Botón para volver (Ubicado al final de la página) */}
        <div className="mt-16 flex justify-center">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center text-neutral-400 border border-neutral-800 px-8 py-3 hover:border-azul-logo hover:text-azul-logo transition-colors text-xs uppercase tracking-widest font-bold group"
          >
            <span className="mr-3 transform group-hover:-translate-x-2 transition-transform duration-300">←</span> Volver Atrás
          </button>
        </div>

      </div>

      {/* ======== MODAL VISOR DE IMÁGENES GIGANTE ======== */}
      {fotoIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-neutral-950/95 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={cerrarFoto} 
        >
          {/* Botón Cerrar */}
          <button onClick={cerrarFoto} className="absolute top-6 right-6 text-neutral-400 hover:text-white text-4xl z-50 transition-colors focus:outline-none">
            &times;
          </button>

          {/* Flecha Izquierda */}
          <button onClick={fotoAnterior} className="absolute left-2 md:left-10 text-neutral-400 hover:text-white text-5xl md:text-6xl z-50 p-4 transition-colors focus:outline-none">
            &#8249;
          </button>

          {/* Imagen Ampliada */}
          <img 
            src={trabajo.fotos[fotoIndex]} 
            alt="Ampliada" 
            className="max-w-full max-h-[90vh] object-contain shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()} 
          />

          {/* Flecha Derecha */}
          <button onClick={fotoSiguiente} className="absolute right-2 md:right-10 text-neutral-400 hover:text-white text-5xl md:text-6xl z-50 p-4 transition-colors focus:outline-none">
            &#8250;
          </button>
          
          {/* Contador */}
          <span className="absolute bottom-6 text-azul-logo text-xs tracking-widest font-bold uppercase">
            {fotoIndex + 1} / {trabajo.fotos.length}
          </span>
        </div>
      )}

    </div>
  );
};

export default DetalleTrabajo;