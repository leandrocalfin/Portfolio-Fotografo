import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no está configurado.');

      return res.status(500).json({
        mensaje: 'Error interno del servidor.'
      });
    }

    // ==========================================
    // 1. OBTENER JWT DESDE COOKIE HTTPONLY
    // ==========================================

    const token = req.cookies?.auth_token;

    if (!token) {
      return res.status(401).json({
        mensaje: 'Acceso no autorizado.'
      });
    }

    // ==========================================
    // 2. VERIFICAR JWT
    // ==========================================

    const decodificado = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ['HS256']
      }
    );

    // ==========================================
    // 3. VALIDAR PAYLOAD
    // ==========================================

    if (!decodificado.id || !decodificado.csrf) {
      return res.status(401).json({
        mensaje: 'Token no válido.'
      });
    }

    // Solo dejamos disponibles los datos
    // que realmente necesita la aplicación.
    req.usuario = {
      id: decodificado.id,
      csrf: decodificado.csrf
    };

    next();

  } catch (error) {
    return res.status(401).json({
      mensaje: 'Token no válido o expirado.'
    });
  }
};