import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ==========================================
// AGREGAR CSRF EN PETICIONES QUE MODIFICAN DATOS
// ==========================================

api.interceptors.request.use((config) => {
  const metodo = config.method?.toLowerCase();

  const requiereCsrf = [
    "post",
    "put",
    "patch",
    "delete",
  ].includes(metodo);

  if (requiereCsrf) {
    const csrfToken = sessionStorage.getItem("csrfToken");

    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
  }

  return config;
});

// ==========================================
// MANEJO GLOBAL DE SESIÓN EXPIRADA
// ==========================================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const url = error.config?.url || "";

    const esLogin = url.includes("/api/usuarios/login");
    const esChequeoSesion = url.includes(
      "/api/usuarios/sesion"
    );

    if (
      error.response?.status === 401 &&
      !esLogin &&
      !esChequeoSesion
    ) {
      // Eliminamos únicamente información auxiliar.
      // El JWT real está en una cookie HttpOnly.
      sessionStorage.removeItem("csrfToken");
      localStorage.removeItem("ultimaActividad");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;