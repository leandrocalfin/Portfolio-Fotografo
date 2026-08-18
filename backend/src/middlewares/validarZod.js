import { ZodError } from 'zod';

export const validarEsquema = (esquema) => (req, res, next) => {
  try {
    // ==========================================
    // 1. OBTENER FOTOS SI EXISTEN
    // ==========================================

    const urlsFotos = Array.isArray(req.files)
      ? req.files.map((archivo) => archivo.path)
      : [];

    // ==========================================
    // 2. PREPARAR DATOS PARA ZOD
    // ==========================================

    const datosAValidar = {
      ...req.body
    };

    // Solo agregamos "fotos" cuando realmente
    // estamos procesando archivos múltiples.
    if (Array.isArray(req.files)) {
      datosAValidar.fotos = urlsFotos;
    }

    // ==========================================
    // 3. VALIDAR
    // ==========================================

    const datosValidados = esquema.parse(datosAValidar);

    // Reemplazamos el body por los datos que
    // Zod ya validó y transformó.
    req.body = datosValidados;

    next();

  } catch (error) {

    // ==========================================
    // ERROR DE VALIDACIÓN
    // ==========================================

    if (error instanceof ZodError) {
      return res.status(400).json({
        mensaje: 'Los datos enviados no son válidos.',
        errores: error.issues.map((issue) => issue.message)
      });
    }

    // ==========================================
    // ERROR INESPERADO
    // ==========================================

    console.error('ERROR EN VALIDACIÓN:', error);

    return res.status(500).json({
      mensaje: 'Error interno del servidor.'
    });
  }
};