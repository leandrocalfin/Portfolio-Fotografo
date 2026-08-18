import rateLimit from 'express-rate-limit';

// ==========================================
// PROTECCIÓN CONTRA FUERZA BRUTA EN LOGIN
// ==========================================

export const loginLimiter = rateLimit({
  // Ventana de tiempo: 15 minutos
  windowMs: 15 * 60 * 1000,

  // Máximo de intentos fallidos por IP
  max: 5,

  // Los logins exitosos no consumen intentos
  skipSuccessfulRequests: true,

  // Respuesta cuando se supera el límite
  message: {
    mensaje:
      'Demasiados intentos de inicio de sesión. Intenta nuevamente en 15 minutos.'
  },

  standardHeaders: true,
  legacyHeaders: false
});