import { Router } from 'express';

import {
  obtenerServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio
} from '../controllers/servicioController.js';

import { verificarToken } from '../middlewares/authMiddleware.js';
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
// Requieren JWT Bearer válido
// ==========================================

// Crear servicio
router.post(
  '/',
  verificarToken,
  uploadFotos.single('imagen'),
  crearServicio
);

// Actualizar servicio
router.put(
  '/:id',
  verificarToken,
  uploadFotos.single('imagen'),
  actualizarServicio
);

// Eliminar servicio
router.delete(
  '/:id',
  verificarToken,
  eliminarServicio
);

export default router;