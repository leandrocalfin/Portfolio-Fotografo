export const validarEsquema = (esquema) => (req, res, next) => {
  try {
    // 1. Extraemos las URLs que Multer/Cloudinary nos dejó en req.files
    // (Si req.files no existe, devolvemos un array vacío)
    const urlsFotos = req.files ? req.files.map(archivo => archivo.path) : [];

    // 2. Unimos el texto del body con el array de fotos para que Zod lo vea todo junto
    const datosAValidar = {
      ...req.body,
      fotos: urlsFotos 
    };

    // 3. Zod ahora revisa todo el paquete completo
    esquema.parse(datosAValidar);
    
    // Si pasa la validación, seguimos al controlador
    next(); 
  } catch (error) {
    // Si falla, devolvemos los errores prolijos
    return res.status(400).json({
      mensaje: "Errores de validación en los datos enviados.",
      errores: error.errors.map(err => err.message)
    });
  }
};