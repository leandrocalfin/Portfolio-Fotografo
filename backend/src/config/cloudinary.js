import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Asegurarnos de que las variables de entorno estén cargadas
dotenv.config();

// 1. Configuramos la conexión con tus credenciales del .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Le decimos a Multer dónde y cómo guardar los archivos
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_fotografo', // Cloudinary creará esta carpeta automáticamente
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Bloqueamos PDFs o archivos maliciosos
  },
});

// 3. Exportamos el middleware (el inspector) para usarlo en nuestras rutas
export const uploadFotos = multer({ storage: storage });