import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');

  // Si NO estamos en la página de inicio ('/'), forzamos que el navbar actúe como si tuviera scroll
  const esPaginaInterna = location.pathname !== '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cerrarMenu = () => setMenuAbierto(false);

  const manejarCerrarSesion = () => {
    localStorage.removeItem('token');
    cerrarMenu();
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    cerrarMenu();

    const irALaSeccion = () => {
      if (sectionId === 'inicio') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const section = document.getElementById(sectionId);
        if (section) {
          const titulo = section.querySelector('.text-center') || section;
          const compensacion = 150;
          const y = titulo.getBoundingClientRect().top + window.scrollY - compensacion;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(irALaSeccion, 100);
    } else {
      irALaSeccion();
    }
  };

  // Determinamos si debe verse con estilo sólido (si hay scroll, menú abierto o estamos en otra página)
  const navbarSolido = scrolled || menuAbierto || esPaginaInterna;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      navbarSolido
        ? 'bg-crema-suave dark:bg-neutral-950 border-b border-neutral-300/60 dark:border-white/5 shadow-md'
        : 'bg-transparent border-transparent pt-4'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-24">

          <button onClick={() => scrollToSection('inicio')} className="flex items-center gap-3 group z-50 cursor-pointer">
            <img
              src={navbarSolido && document.documentElement.classList.contains('dark') === false ? "/logo.png" : "/logo2.png"}
              alt="MB Fotografía"
              className="h-10 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className={`text-xl md:text-2xl tracking-widest font-bold transition-colors ${navbarSolido ? 'text-neutral-900 dark:text-white' : 'text-white'}`}>
              FOTOGRAFÍA
            </span>
          </button>

          {/* CONTENEDOR DERECHO PARA MÓVILES (ThemeToggle + Menú Hamburguesa) */}
          <div className="flex items-center gap-4 md:hidden z-50">
            <ThemeToggle />

            <button
              className="text-neutral-900 dark:text-white focus:outline-none"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuAbierto ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* MENÚ DE NAVEGACIÓN (Desktop y Drawer mobile) */}
          <div className={`
            absolute md:static top-0 left-0 w-full md:w-auto h-screen md:h-auto 
            flex flex-col md:flex-row items-center justify-center md:justify-end space-y-8 md:space-y-0 md:space-x-8 lg:space-x-10
            transition-all duration-500 ease-in-out
            ${menuAbierto ? 'bg-crema-suave dark:bg-neutral-950 translate-y-0 opacity-100' : '-translate-y-full md:translate-y-0 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto'}
          `}>

            <button onClick={() => scrollToSection('inicio')} className={`text-sm md:text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 relative group cursor-pointer ${navbarSolido ? 'text-neutral-900 dark:text-neutral-300 hover:text-azul-logo dark:hover:text-white' : 'text-white/90 hover:text-white'}`}>
              Inicio
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full"></span>
            </button>

            <button onClick={() => scrollToSection('sobre-mi')} className={`text-sm md:text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 relative group cursor-pointer ${navbarSolido ? 'text-neutral-900 dark:text-neutral-300 hover:text-azul-logo dark:hover:text-white' : 'text-white/90 hover:text-white'}`}>
              Sobre Mí
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full"></span>
            </button>

            <Link to="/galeria" onClick={cerrarMenu} className={`text-sm md:text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 relative group ${navbarSolido ? 'text-neutral-900 dark:text-neutral-300 hover:text-azul-logo dark:hover:text-white' : 'text-white/90 hover:text-white'}`}>
              Galería
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <button onClick={() => scrollToSection('servicios')} className={`text-sm md:text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 relative group cursor-pointer ${navbarSolido ? 'text-neutral-900 dark:text-neutral-300 hover:text-azul-logo dark:hover:text-white' : 'text-white/90 hover:text-white'}`}>
              Servicios
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full"></span>
            </button>

            <button onClick={() => scrollToSection('contacto')} className={`text-sm md:text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 relative group cursor-pointer ${navbarSolido ? 'text-neutral-900 dark:text-neutral-300 hover:text-azul-logo dark:hover:text-white' : 'text-white/90 hover:text-white'}`}>
              Contacto
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full"></span>
            </button>

            {token ? (
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-4 mt-4 md:mt-0">
                <Link
                  to="/dashboard"
                  onClick={cerrarMenu}
                  className="text-xs font-bold uppercase tracking-[0.15em] text-azul-logo hover:text-neutral-900 dark:hover:text-white transition-colors duration-300 relative group"
                >
                  Mi Panel
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <button
                  onClick={manejarCerrarSesion}
                  className="text-xs font-bold uppercase tracking-widest text-red-500 border border-red-500/40 px-6 py-2.5 hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={cerrarMenu}
                className={`text-xs font-bold uppercase tracking-widest px-6 py-2.5 transition-all duration-300 ${
                  navbarSolido
                    ? 'text-neutral-900 border border-neutral-300 hover:bg-azul-logo hover:text-white hover:border-azul-logo dark:text-white dark:border-white/40'
                    : 'text-white border border-white/40 bg-black/20 backdrop-blur-sm hover:bg-azul-logo hover:border-azul-logo'
                }`}
              >
                Ingresar
              </Link>
            )}

            <div className="hidden md:block">
              <ThemeToggle />
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;