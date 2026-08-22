import { isValidObjectId } from 'mongoose';

// ==========================================
// VALIDAR FORMATO DE ObjectId
// ==========================================

/*
  Los _id de MongoDB son siempre 24 caracteres
  hexadecimales (ej: 507f1f77bcf86cd799439011).

  Si llega cualquier otra cosa por req.params.id
  y la pasamos directo a findById(), Mongoose
  lanza un CastError y el catch responde 500
  "Error interno del servidor" — lo cual es
  falso: nada falló adentro, el cliente mandó
  basura.

  Validamos ANTES de tocar la base de datos:
  - Formato inválido -> 404 (no existe nada con esa id)
  - Logs limpios: los errores 500 quedan solo
    para problemas reales del servidor.
*/

export const validarObjectId = (
  req,
  res,
  next
) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    return res.status(404).json({
      mensaje:
        'Recurso no encontrado.'
    });
  }

  next();
};
