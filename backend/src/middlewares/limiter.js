import rateLimit from 'express-rate-limit';

// ==========================================
// 1. RATE LIMITER GLOBAL
// ==========================================

/*
  Capa gruesa para TODA la API.

  Protege contra:
  - DoS baratos que saturan la instancia de Render
  - Scraping agresivo del contenido público

  El límite es generoso a propósito: una persona
  navegando el portfolio hace apenas unas pocas
  llamadas por página. 500 cada 15 minutos está
  muy por encima de cualquier uso humano normal.
*/

export const limiterGlobal = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 500,

  message: {
    mensaje:
      'Demasiadas solicitudes desde esta IP. Intenta nuevamente más tarde.'
  },

  standardHeaders: true,
  legacyHeaders: false
});

// ==========================================
// 2. PROTECCIÓN CONTRA FUERZA BRUTA EN LOGIN
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