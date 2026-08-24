import express from 'express';

import {
  loginUsuario,
  cerrarSesion,
  cambiarPassword,
  obtenerPerfil,
  actualizarAvatar,
  actualizarPortada,
  actualizarPosicionPortada,
  actualizarInfoPerfil,
  actualizarTextoSobreMi,
  actualizarFotoSobreMi,
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
  cambiarPasswordSchema,
  sobreMiSchema,
  portadaPosicionSchema
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

// Actualizar foto de portada (hero de Inicio)
router.put(
  '/perfil/portada',
  verificarToken,
  verificarCsrf,
  uploadFotos.single('imagen'),
  actualizarPortada
);

// Reencuadrar la portada sin volver a subirla
router.put(
  '/perfil/portada/posicion',
  verificarToken,
  verificarCsrf,
  validarEsquema(portadaPosicionSchema),
  actualizarPosicionPortada
);

// Actualizar texto de Sobre Mí
router.put(
  '/perfil/sobre-mi',
  verificarToken,
  verificarCsrf,
  validarEsquema(sobreMiSchema),
  actualizarTextoSobreMi
);

// Actualizar foto de Sobre Mí
router.put(
  '/perfil/sobre-mi/imagen',
  verificarToken,
  verificarCsrf,
  uploadFotos.single('imagen'),
  actualizarFotoSobreMi
);

export default router;