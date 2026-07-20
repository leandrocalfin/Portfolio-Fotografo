import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  // 1. Buscamos el token en las cabeceras (headers) de la petición
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // El formato estándar es "Bearer ej123token...", así que lo separamos para quedarnos solo con el token
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Si no hay token, bloqueamos la puerta inmediatamente (Status 401: No autorizado)
  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No hay token de autenticación.' });
  }

  try {
    // 3. Verificamos que el token sea auténtico usando nuestra palabra secreta del .env
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Si es válido, guardamos el ID del usuario en la petición y le decimos "puedes pasar" (next)
    req.usuario = decodificado;
    next(); 
  } catch (error) {
    // Si el token expiró o fue inventado, lo rebotamos
    res.status(401).json({ mensaje: 'Token no válido o expirado.' });
  }
};