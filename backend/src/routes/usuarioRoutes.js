import express from 'express';

import {
  loginUsuario,
  cambiarPassword,
  obtenerPerfil,
  actualizarAvatar,
  actualizarInfoPerfil,
  obtenerPerfilPublico
} from '../controllers/usuarioController.js';

import { loginLimiter } from '../middlewares/limiter.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { validarEsquema } from '../middlewares/validarZod.js';

import {
  loginSchema,
  cambiarPasswordSchema
} from '../schemas/usuarioSchema.js';

import { uploadFotos } from '../config/cloudinary.js';

const router = express.Router();

// ==========================================
// RUTAS PÚBLICAS
// ==========================================

router.post(
  '/login',
  loginLimiter,
  validarEsquema(loginSchema),
  loginUsuario
);

router.get(
  '/perfil-publico',
  obtenerPerfilPublico
);

// ==========================================
// RUTAS PRIVADAS
// Requieren JWT Bearer válido
// ==========================================

// Obtener perfil del administrador
router.get(
  '/perfil',
  verificarToken,
  obtenerPerfil
);

// Cambiar contraseña
router.put(
  '/cambiar-password',
  verificarToken,
  validarEsquema(cambiarPasswordSchema),
  cambiarPassword
);

// Actualizar avatar
router.put(
  '/perfil/avatar',
  verificarToken,
  uploadFotos.single('imagen'),
  actualizarAvatar
);

// Actualizar WhatsApp / Instagram
router.put(
  '/perfil/info',
  verificarToken,
  actualizarInfoPerfil
);

export default router;