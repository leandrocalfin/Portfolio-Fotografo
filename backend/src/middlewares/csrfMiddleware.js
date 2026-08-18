import crypto from 'crypto';

export const verificarCsrf = (req, res, next) => {
  const csrfHeader = req.get('X-CSRF-Token');
  const csrfJwt = req.usuario?.csrf;

  if (!csrfHeader || !csrfJwt) {
    return res.status(403).json({
      mensaje: 'Solicitud no autorizada.'
    });
  }

  try {
    const headerBuffer = Buffer.from(csrfHeader, 'utf8');
    const jwtBuffer = Buffer.from(csrfJwt, 'utf8');

    if (headerBuffer.length !== jwtBuffer.length) {
      return res.status(403).json({
        mensaje: 'Solicitud no autorizada.'
      });
    }

    const coincide = crypto.timingSafeEqual(
      headerBuffer,
      jwtBuffer
    );

    if (!coincide) {
      return res.status(403).json({
        mensaje: 'Solicitud no autorizada.'
      });
    }

    next();

  } catch {
    return res.status(403).json({
      mensaje: 'Solicitud no autorizada.'
    });
  }
};