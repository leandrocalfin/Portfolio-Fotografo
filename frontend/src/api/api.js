import axios from "axios";

// ==========================================
// LEER LA COOKIE CSRF
// ==========================================

/*
  El backend deja DOS cookies en el login:

  - token      -> HttpOnly: JavaScript NO puede leerla.
                  El navegador la adjunta solo.

  - csrf_token -> legible a propósito: hay que copiarla
                  al header X-CSRF-Token en cada mutación
                  (patrón double-submit cookie).

  Esta función solo puede ver csrf_token; la HttpOnly
  es invisible para document.cookie por diseño.
*/

const leerCookie = (nombre) => {
  const coincidencia = document.cookie.match(
    new RegExp(`(?:^|; )${nombre}=([^;]*)`)
  );

  return coincidencia
    ? decodeURIComponent(coincidencia[1])
    : null;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  // IMPRESCINDIBLE: sin esto axios no envía ni
  // recibe cookies entre dominios distintos.
  withCredentials: true,
});

// ==========================================
// AGREGAR TOKEN CSRF A CADA PETICIÓN
// ==========================================

api.interceptors.request.use(
  (config) => {
    const tokenCsrf = leerCookie("csrf_token");

    if (tokenCsrf) {
      config.headers["X-CSRF-Token"] = tokenCsrf;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// MANEJO GLOBAL DE SESIÓN EXPIRADA
// ==========================================

/*
  'sesionIniciada' NO es una credencial: es solo un
  indicador de UX para saber si vale la pena intentar
  llamar a /perfil. La sesión real vive únicamente
  en la cookie HttpOnly del servidor.
*/

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status =
      error.response?.status;

    const url =
      error.config?.url || "";

    // Si el error viene del login,
    // NO queremos redirigir automáticamente.
    const esLogin =
      url.includes(
        "/api/usuarios/login"
      );

    if (
      (status === 401 ||
        status === 403) &&
      !esLogin
    ) {
      localStorage.removeItem(
        "sesionIniciada"
      );

      localStorage.removeItem(
        "ultimaActividad"
      );

      if (
        window.location.pathname !==
        "/login"
      ) {
        window.location.href =
          "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
