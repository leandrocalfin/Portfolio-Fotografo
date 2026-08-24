import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// ==========================================
// 1. VALIDAR VARIABLES DE ENTORNO
// ==========================================

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} = process.env;

if (
  !CLOUDINARY_CLOUD_NAME ||
  !CLOUDINARY_API_KEY ||
  !CLOUDINARY_API_SECRET
) {
  throw new Error(
    'Faltan variables de entorno necesarias para Cloudinary.'
  );
}


// ==========================================
// 2. CONFIGURAR CLOUDINARY
// ==========================================

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});


// ==========================================
// 3. CONFIGURAR STORAGE
// ==========================================

const storage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: 'portfolio_fotografo',

    allowed_formats: [
      'jpg',
      'jpeg',
      'png',
      'webp'
    ]
  }
});


// ==========================================
// 4. CONFIGURAR MULTER
// ==========================================

export const uploadFotos = multer({

  storage,

  limits: {
    // Máximo 15 MB por imagen
    fileSize: 15 * 1024 * 1024,

    // Máximo 7 archivos por request
    files: 7
  },

  fileFilter: (req, file, cb) => {

    const tiposPermitidos = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!tiposPermitidos.includes(file.mimetype)) {
      return cb(
        new multer.MulterError(
          'LIMIT_UNEXPECTED_FILE',
          file.fieldname
        )
      );
    }

    cb(null, true);
  }

});