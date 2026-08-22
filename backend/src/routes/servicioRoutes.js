import { Router } from 'express';

import {
  obtenerServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio
} from '../controllers/servicioController.js';

import {
  verificarToken,
  verificarCsrf
} from '../middlewares/authMiddleware.js';
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
// Requieren cookie JWT válida + header CSRF
// ==========================================

// Crear servicio
router.post(
  '/',
  verificarToken,
  verificarCsrf,
  uploadFotos.single('imagen'),
  crearServicio
);

// Actualizar servicio
router.put(
  '/:id',
  verificarToken,
  verificarCsrf,
  uploadFotos.single('imagen'),
  actualizarServicio
);

// Eliminar servicio
router.delete(
  '/:id',
  verificarToken,
  verificarCsrf,
  eliminarServicio
);

export default router;