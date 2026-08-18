import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ==========================================
// AGREGAR JWT A LAS PETICIONES
// ==========================================

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
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
        "token"
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