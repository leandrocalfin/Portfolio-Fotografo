import express from 'express';

import {
  loginUsuario,
  cerrarSesion,
  cambiarPassword,
  obtenerPerfil,
  actualizarAvatar,
  actualizarInfoPerfil,
  obtenerPerfilPublico
} from '../controllers/usuarioController.js';

import {
  loginLimiter
} from '../middlewares/limiter.js';

import {
  verificarToken,
  verificarCsrf
} from '../middlewares/authMiddleware.js';
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
// Requieren cookie JWT válida + header CSRF
// ==========================================

// Cerrar sesión (borra las cookies)
router.post(
  '/logout',
  cerrarSesion
);

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
  verificarCsrf,
  validarEsquema(cambiarPasswordSchema),
  cambiarPassword
);

// Actualizar avatar
router.put(
  '/perfil/avatar',
  verificarToken,
  verificarCsrf,
  uploadFotos.single('imagen'),
  actualizarAvatar
);

// Actualizar WhatsApp / Instagram
router.put(
  '/perfil/info',
  verificarToken,
  verificarCsrf,
  actualizarInfoPerfil
);

export default router;