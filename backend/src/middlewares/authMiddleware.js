import crypto from 'node:crypto';

import jwt from 'jsonwebtoken';

import { Usuario } from '../models/Usuario.js';

// ==========================================
// 1. VERIFICAR EL JWT (VIA COOKIE HttpOnly)
// ==========================================

export const verificarToken = async (req, res, next) => {
  try {
    // ==========================================
    // 1.1 COMPROBAR JWT_SECRET
    // ==========================================

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no está configurado.');

      return res.status(500).json({
        mensaje: 'Error interno del servidor.'
      });
    }

    // ==========================================
    // 1.2 OBTENER LA COOKIE
    // ==========================================

    /*
      El JWT ya no viaja en el header Authorization.
      Ahora vive en una cookie HttpOnly que el navegador
      adjunta automáticamente y que JavaScript NO puede leer.
    */

    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        mensaje: 'Acceso no autorizado.'
      });
    }

    // ==========================================
    // 1.3 VERIFICAR EL JWT
    // ==========================================

    const decodificado = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ['HS256']
      }
    );

    // ==========================================
    // 1.4 VALIDAR PAYLOAD
    // ==========================================

    if (!decodificado.id) {
      return res.status(401).json({
        mensaje: 'Token no válido.'
      });
    }

    // ==========================================
    // 1.5 VERIFICAR tokenVersion (REVOCACIÓN)
    // ==========================================

    /*
      La firma matemática solo prueba que NOSOTROS
      emitimos el token y que no fue alterado. No
      prueba que siga vigente.

      Comparamos la versión embebida contra la
      versión actual del usuario en la BD: si alguien
      cambió la contraseña o cerró sesión, la versión
      se incrementó y este token queda huérfano.

      Costo: una consulta indexada por request.
      Beneficio: poder de revocación inmediata.
    */

    const usuarioActual =
      await Usuario.findById(
        decodificado.id
      ).select('tokenVersion');

    if (!usuarioActual) {
      return res.status(401).json({
        mensaje: 'Token no válido.'
      });
    }

    if (
      decodificado.tokenVersion !==
      usuarioActual.tokenVersion
    ) {
      return res.status(401).json({
        mensaje:
          'La sesión ya no es válida. Iniciá sesión nuevamente.'
      });
    }

    req.usuario = {
      id: decodificado.id
    };

    next();

  } catch (error) {
    return res.status(401).json({
      mensaje: 'Token no válido o expirado.'
    });
  }
};

// ==========================================
// 2. VERIFICAR TOKEN CSRF (DOUBLE SUBMIT)
// ==========================================

/*
  Patrón double-submit cookie:

  - El backend deja DOS cookies en el login:
      token       (HttpOnly, invisible para JS)
      csrf_token  (legible por JS, valor aleatorio)

  - El frontend debe reenviar csrf_token en el
    header X-CSRF-Token.

  - Si alguien desde otro sitio logra que el navegador
    envíe peticiones con la cookie (CSRF), NO puede leer
    la cookie para copiar su valor al header, así que
    la comparación falla.

  La comparación usa timingSafeEqual: tarda siempre lo
  mismo sin importar dónde difieren los valores, lo que
  impide ataques de medición de tiempo (timing attacks).
*/

export const verificarCsrf = (req, res, next) => {
  const tokenHeader =
    req.headers['x-csrf-token'];

  const tokenCookie =
    req.cookies?.csrf_token;

  if (
    !tokenHeader ||
    !tokenCookie ||
    tokenHeader.length !== tokenCookie.length ||
    !crypto.timingSafeEqual(
      Buffer.from(tokenHeader),
      Buffer.from(tokenCookie)
    )
  ) {
    return res.status(403).json({
      mensaje:
        'Petición rechazada: verificación CSRF fallida.'
    });
  }

  next();
};
