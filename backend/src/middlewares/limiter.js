import rateLimit from 'express-rate-limit';

// Creamos un escudo específico para la ruta de Login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Tiempo de castigo: 15 minutos (en milisegundos)
  max: 5, // Límite: 5 intentos fallidos o exitosos por IP dentro de esos 15 minutos
  message: { 
    mensaje: 'Demasiados intentos de inicio de sesión desde esta IP. Por favor, intenta de nuevo en 15 minutos.' 
  },
  standardHeaders: true, // Devuelve información del límite en las cabeceras HTTP
  legacyHeaders: false, // Deshabilita cabeceras antiguas
});