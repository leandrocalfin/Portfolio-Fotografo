import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  try {
    // ==========================================
    // 1. COMPROBAR JWT_SECRET
    // ==========================================

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no está configurado.');

      return res.status(500).json({
        mensaje: 'Error interno del servidor.'
      });
    }

    // ==========================================
    // 2. OBTENER HEADER AUTHORIZATION
    // ==========================================

    const authorization =
      req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        mensaje: 'Acceso no autorizado.'
      });
    }

    /*
      Formato esperado:

      Authorization: Bearer eyJhbGciOi...
    */

    const partes =
      authorization.split(' ');

    if (
      partes.length !== 2 ||
      partes[0] !== 'Bearer' ||
      !partes[1]
    ) {
      return res.status(401).json({
        mensaje: 'Acceso no autorizado.'
      });
    }

    const token = partes[1];

    // ==========================================
    // 3. VERIFICAR JWT
    // ==========================================

    const decodificado = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ['HS256']
      }
    );

    // ==========================================
    // 4. VALIDAR PAYLOAD
    // ==========================================

    if (!decodificado.id) {
      return res.status(401).json({
        mensaje: 'Token no válido.'
      });
    }

    // Solo guardamos lo que necesitamos
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