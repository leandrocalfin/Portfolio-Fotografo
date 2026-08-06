import express from 'express';
// 1. Importamos también las funciones de perfil y avatar del controlador
import { registrarUsuario, loginUsuario, cambiarPassword, obtenerPerfil, actualizarAvatar } from '../controllers/usuarioController.js';

// Importamos los escudos y validadores
import { loginLimiter } from '../middlewares/limiter.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { validarEsquema } from '../middlewares/validarZod.js';
import { cambiarPasswordSchema } from '../schemas/usuarioSchema.js';
import upload from '../middlewares/upload.js'; // O la ruta donde tengas tu multer configurado

const router = express.Router();

// ==========================================
// RUTAS PÚBLICAS
// ==========================================
router.post('/registro', registrarUsuario);
router.post('/login', loginLimiter, loginUsuario);

// ==========================================
// RUTAS PRIVADAS
// ==========================================
router.put('/cambiar-password', 
  verificarToken, 
  validarEsquema(cambiarPasswordSchema), 
  cambiarPassword 
);

// 2. Nueva ruta para obtener los datos del perfil (incluyendo el avatar)
router.get('/perfil', 
  verificarToken, 
  obtenerPerfil
);

// 3. Nueva ruta para actualizar la foto de perfil (avatar)
router.put('/perfil/avatar', 
  verificarToken, 
  upload.single('imagen'), // Nombre del campo que mandará el frontend
  actualizarAvatar
);

export default router;