import { Router } from 'express';
import { obtenerServicios, crearServicio, actualizarServicio, eliminarServicio } from '../controllers/servicioController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { uploadFotos as upload } from '../config/cloudinary.js';

const router = Router();

router.get('/', obtenerServicios);
router.post('/', verificarToken, upload.any(), crearServicio); // 👈 Usamos any() para evitar el choque de nombres
router.put('/:id', verificarToken, upload.any(), actualizarServicio);
router.delete('/:id', verificarToken, eliminarServicio);

export default router;