import express from 'express';
// 1. Importamos también actualizarInfoPerfil
import { registrarUsuario, loginUsuario, cambiarPassword, obtenerPerfil, actualizarAvatar, actualizarInfoPerfil } from '../controllers/usuarioController.js';

// Importamos los escudos y validadores
import { loginLimiter } from '../middlewares/limiter.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { validarEsquema } from '../middlewares/validarZod.js';
import { cambiarPasswordSchema } from '../schemas/usuarioSchema.js';
import { uploadFotos } from '../middlewares/upload.js'; // O la ruta donde tengas tu multer configurado

const router = express.Router();

// ==========================================
// RUTAS PÚBLICAS
// ==========================================
router.post('/login', loginLimiter, loginUsuario);

// ==========================================
// RUTAS PRIVADAS
// ==========================================
router.put('/cambiar-password', 
  verificarToken, 
  validarEsquema(cambiarPasswordSchema), 
  cambiarPassword 
);

// Ruta para obtener los datos del perfil (avatar, email, redes)
router.get('/perfil', 
  verificarToken, 
  obtenerPerfil
);

// Ruta para actualizar la foto de perfil (avatar)
router.put(
  '/perfil/avatar',
  verificarToken,
  uploadFotos.single('imagen'),
  actualizarAvatar
);

// NUEVA RUTA: Para actualizar WhatsApp e Instagram
router.put('/perfil/info', 
  verificarToken, 
  actualizarInfoPerfil
);

export default router;