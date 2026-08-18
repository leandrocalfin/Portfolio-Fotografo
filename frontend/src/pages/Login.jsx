import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api/api';

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
      const respuesta = await api.post(
        '/api/usuarios/login',
        {
          email,
          password
        }
      );

      // El JWT NO se guarda en localStorage.
      // El backend lo envía como cookie HttpOnly.
      sessionStorage.setItem(
        'csrfToken',
        respuesta.data.csrfToken
      );

      localStorage.setItem(
        'ultimaActividad',
        Date.now()
      );

      navigate('/dashboard');

    } catch (err) {
      console.error('Error en el login:', err);

      setError(
        err.response?.data?.mensaje ||
        'Error al iniciar sesión. Verifica tus credenciales.'
      );

    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-crema-suave dark:bg-neutral-950 flex flex-col justify-center items-center px-6 relative z-10 transition-colors duration-300">

      <div className="w-full max-w-md bg-[#78A4CB]/15 dark:bg-neutral-900 p-8 md:p-12 shadow-xl border-t-4 border-t-azul-logo relative overflow-hidden transition-colors">

        <div className="text-center mb-10">
          <h2 className="text-3xl text-neutral-900 dark:text-white font-titulos font-bold uppercase tracking-widest mb-2 transition-colors">
            Acceso
          </h2>

          <p className="text-neutral-500 text-xs tracking-[0.2em] uppercase font-bold">
            Panel de Administración
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-500 dark:text-red-400 text-xs text-center p-4 mb-6 uppercase tracking-widest font-bold">
            {error}
          </div>
        )}

        <form
          onSubmit={manejarSubmit}
          className="flex flex-col gap-8 relative z-10"
        >
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-700 dark:text-neutral-300 ml-1">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/70 dark:bg-neutral-950 border-b border-azul-logo/30 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-azul-logo transition-colors duration-300 font-textos text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
              placeholder="admin@tuweb.com"
              autoComplete="username"
              maxLength={254}
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-700 dark:text-neutral-300 ml-1">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/70 dark:bg-neutral-950 border-b border-azul-logo/30 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-azul-logo transition-colors duration-300 font-textos text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
              placeholder="••••••••"
              autoComplete="current-password"
              maxLength={128}
              required
            />
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={cargando}
              className="w-full text-xs font-bold uppercase tracking-widest text-white border border-azul-logo bg-azul-logo px-10 py-4 hover:bg-transparent hover:text-neutral-900 dark:hover:text-white transition-all duration-300 disabled:opacity-50 disabled:hover:bg-azul-logo disabled:hover:text-white disabled:cursor-not-allowed cursor-pointer shadow-md"
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
