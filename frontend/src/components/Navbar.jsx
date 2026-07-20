import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

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

  // LÓGICA INTELIGENTE: Rastreador automático de títulos
  const scrollToSection = (sectionId) => {
    cerrarMenu(); 

    const irALaSeccion = () => {
      if (sectionId === 'inicio') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const section = document.getElementById(sectionId);
        if (section) {
          // Buscamos el contenedor del título (que tiene la clase text-center)
          const titulo = section.querySelector('.text-center') || section;
          
          // 150px asegura que el título quede siempre a la vista debajo de la barra
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

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      scrolled || menuAbierto
        ? 'bg-neutral-950/95 backdrop-blur-md border-b border-white/5 shadow-lg' 
        : 'bg-transparent border-transparent pt-4'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-24">
          
          <button onClick={() => scrollToSection('inicio')} className="flex items-center gap-3 group z-50 cursor-pointer">
            <img 
              src="/logo2.png" 
              alt="MB Fotografía" 
              className="h-10 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className="text-xl md:text-2xl tracking-widest font-bold bg-gradient-to-r from-white to-azul-logo text-transparent bg-clip-text">
              FOTOGRAFÍA
            </span>
          </button>

          <button 
            className="md:hidden z-50 text-white focus:outline-none"
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

          <div className={`
            absolute md:static top-0 left-0 w-full md:w-auto h-screen md:h-auto bg-neutral-950 md:bg-transparent
            flex flex-col md:flex-row items-center justify-center md:justify-end space-y-8 md:space-y-0 md:space-x-8 lg:space-x-10
            transition-all duration-500 ease-in-out
            ${menuAbierto ? 'translate-y-0 opacity-100' : '-translate-y-full md:translate-y-0 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto'}
          `}>
            
            <button onClick={() => scrollToSection('inicio')} className="text-sm md:text-xs font-bold uppercase tracking-[0.15em] text-neutral-300 hover:text-white transition-colors duration-300 relative group">
              Inicio
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full"></span>
            </button>
            
            <button onClick={() => scrollToSection('sobre-mi')} className="text-sm md:text-xs font-bold uppercase tracking-[0.15em] text-neutral-300 hover:text-white transition-colors duration-300 relative group">
              Sobre Mí
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full"></span>
            </button>
            
            <Link to="/galeria" onClick={cerrarMenu} className="text-sm md:text-xs font-bold uppercase tracking-[0.15em] text-neutral-300 hover:text-white transition-colors duration-300 relative group">
              Galería
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <button onClick={() => scrollToSection('servicios')} className="text-sm md:text-xs font-bold uppercase tracking-[0.15em] text-neutral-300 hover:text-white transition-colors duration-300 relative group">
              Servicios
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full"></span>
            </button>
            
            <button onClick={() => scrollToSection('contacto')} className="text-sm md:text-xs font-bold uppercase tracking-[0.15em] text-neutral-300 hover:text-white transition-colors duration-300 relative group">
              Contacto
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-azul-logo transition-all duration-300 group-hover:w-full"></span>
            </button>
            
            <Link to="/login" onClick={cerrarMenu} className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest text-azul-logo border border-azul-logo/40 px-6 py-2.5 hover:bg-azul-logo hover:text-white transition-all duration-300">
              Ingresar
            </Link>
            
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;