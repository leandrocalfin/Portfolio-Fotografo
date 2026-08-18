import { Router } from 'express';

import {
  obtenerServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio
} from '../controllers/servicioController.js';

import { verificarToken } from '../middlewares/authMiddleware.js';
import { verificarCsrf } from '../middlewares/csrfMiddleware.js';
import { uploadFotos } from '../config/cloudinary.js';

const router = Router();

// ==========================================
// RUTAS PÚBLICAS
// ==========================================

router.get(
  '/',
  obtenerServicios
);

// ==========================================
// RUTAS PRIVADAS
// ==========================================

router.post(
  '/',
  verificarToken,
  verificarCsrf,
  uploadFotos.single('imagen'),
  crearServicio
);

router.put(
  '/:id',
  verificarToken,
  verificarCsrf,
  uploadFotos.single('imagen'),
  actualizarServicio
);

router.delete(
  '/:id',
  verificarToken,
  verificarCsrf,
  eliminarServicio
);

export default router;