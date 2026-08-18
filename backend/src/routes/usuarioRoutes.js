import express from 'express';

import {
  loginUsuario,
  logoutUsuario,
  obtenerSesion,
  cambiarPassword,
  obtenerPerfil,
  actualizarAvatar,
  actualizarInfoPerfil,
  obtenerPerfilPublico
} from '../controllers/usuarioController.js';

import { loginLimiter } from '../middlewares/limiter.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { verificarCsrf } from '../middlewares/csrfMiddleware.js';
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
// SESIÓN
// ==========================================

router.get(
  '/sesion',
  verificarToken,
  obtenerSesion
);

router.post(
  '/logout',
  verificarToken,
  logoutUsuario
);

// ==========================================
// RUTAS PRIVADAS
// ==========================================

router.get(
  '/perfil',
  verificarToken,
  obtenerPerfil
);

router.put(
  '/cambiar-password',
  verificarToken,
  verificarCsrf,
  validarEsquema(cambiarPasswordSchema),
  cambiarPassword
);

router.put(
  '/perfil/avatar',
  verificarToken,
  verificarCsrf,
  uploadFotos.single('imagen'),
  actualizarAvatar
);

router.put(
  '/perfil/info',
  verificarToken,
  verificarCsrf,
  actualizarInfoPerfil
);

export default router;