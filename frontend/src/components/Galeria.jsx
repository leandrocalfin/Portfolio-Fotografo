import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Galeria = () => {
  const [trabajos, setTrabajos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerTrabajos = async () => {
      try {
        const respuesta = await axios.get(`${import.meta.env.VITE_API_URL}/api/trabajos`);

        // Tomamos solo los últimos 3 trabajos y los invertimos 
        // Agarra del índice 0 al 3 (los 3 más recientes)
        const ultimosTres = respuesta.data.trabajos.slice(0, 3);

        setTrabajos(ultimosTres);
        setCargando(false);
      } catch (error) {
        console.error("Error al cargar los trabajos en el inicio:", error);
        setCargando(false);
      }
    };

    obtenerTrabajos();
  }, []);

  if (cargando) {
    return (
      <div className="py-20 bg-neutral-100 dark:bg-neutral-900 text-center transition-colors duration-300">
        <div className="text-azul-logo text-xl font-light tracking-widest animate-pulse">
          Cargando últimos trabajos...
        </div>
      </div>
    );
  }

  if (trabajos.length === 0) return null;

  return (
    <section id="galeria" className="py-20 bg-neutral-100 dark:bg-neutral-900 w-full transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">

        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light tracking-widest text-neutral-900 dark:text-white uppercase mb-4 transition-colors">
            Últimos <span className="text-azul-logo font-bold">Trabajos</span>
          </h2>
          <div className="h-1 w-20 bg-azul-logo mx-auto rounded"></div>
        </div>

        {/* Grilla con máximo 3 trabajos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {trabajos.map((trabajo) => (
            <Link
              to={`/trabajo/${trabajo._id}`}
              key={trabajo._id}
              className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer aspect-[4/5] bg-neutral-200 dark:bg-neutral-950 block border border-neutral-300 dark:border-white/5 transition-colors"
            >
              {/* Imagen de fondo */}
              <img
                src={trabajo.fotos && trabajo.fotos.length > 0 ? trabajo.fotos[0] : ""}
                alt={trabajo.titulo}
                className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradiente oscuro abajo para legibilidad */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* CONTENEDOR DE TEXTOS */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">

                {/* BLOQUE INSEPARABLE: TÍTULO Y BOTÓN */}
                <div className="flex flex-col">
                  <h3 className="text-white text-xl md:text-2xl font-bold tracking-widest uppercase mb-1">
                    {trabajo.titulo}
                  </h3>
                  <span className="text-azul-logo text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    Ver sesión completa
                    <span className="transform transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
                  </span>
                </div>

                {/* DESCRIPCIÓN */}
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
        </div>

        {/* Botón para ver todo */}
        <div className="text-center">
          <Link
            to="/galeria"
            className="inline-block border border-neutral-400 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 px-8 py-3 rounded-full uppercase tracking-widest text-xs font-semibold hover:border-azul-logo hover:text-azul-logo transition-all duration-300"
          >
            Ver Galería Completa
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Galeria;