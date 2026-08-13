import multer from 'multer';

// Configuración básica con almacenamiento en memoria o disco
const storage = multer.diskStorage({});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB por imagen por seguridad
});

export default upload;