import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  
  const navigate = useNavigate();

  const manejarSubmit = async (e) => {
    e.preventDefault(); 
    setError('');
    setCargando(true);

    try {
      // Usando tu ruta exacta del backend
      const respuesta = await axios.post(`${import.meta.env.VITE_API_URL}/api/usuarios/login`, {
        email,
        password
      });

      // Guardamos el token
      localStorage.setItem('token', respuesta.data.token);
      
      // Redirigimos a tu ruta exacta del panel
      navigate('/dashboard');
      
    } catch (err) {
      console.error("Error en el login:", err);
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center px-6 relative z-10">
      
      <div className="w-full max-w-md bg-neutral-900/40 p-8 md:p-12 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-azul-logo/50 to-transparent opacity-50"></div>
        
        <div className="text-center mb-10">
          <h2 className="text-3xl text-white font-titulos font-bold uppercase tracking-widest mb-2">Acceso</h2>
          <p className="text-neutral-500 text-xs tracking-[0.2em] uppercase font-bold">Panel de Administración</p>
        </div>

        {/* Cartel de error condicional con estilo premium */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-400 text-xs text-center p-4 mb-6 uppercase tracking-widest font-bold">
            {error}
          </div>
        )}

        <form onSubmit={manejarSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-500 ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-neutral-950 border-b border-white/10 px-4 py-3 text-white focus:outline-none focus:border-azul-logo transition-colors duration-300 font-textos text-sm placeholder:text-neutral-700" 
              placeholder="admin@tuweb.com"
              required 
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-500 ml-1">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-neutral-950 border-b border-white/10 px-4 py-3 text-white focus:outline-none focus:border-azul-logo transition-colors duration-300 font-textos text-sm placeholder:text-neutral-700" 
              placeholder="••••••••"
              required 
            />
          </div>

          <div className="flex justify-center mt-4">
            <button 
              type="submit" 
              disabled={cargando}
              className="w-full text-xs font-bold uppercase tracking-widest text-white border border-azul-logo bg-azul-logo px-10 py-4 hover:bg-transparent hover:text-azul-logo transition-all duration-300 disabled:opacity-50 disabled:hover:bg-azul-logo disabled:hover:text-white disabled:cursor-not-allowed"
            >
              {cargando ? 'Verificando...' : 'Ingresar al Sistema'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;