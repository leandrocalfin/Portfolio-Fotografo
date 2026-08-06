import { Router } from 'express';
import { obtenerServicios, crearServicio, actualizarServicio, eliminarServicio } from '../controllers/servicioController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { uploadFotos as upload } from '../config/cloudinary.js';

const router = Router();

router.get('/', obtenerServicios);
// Usamos upload.single('imagen') de forma estricta y segura
router.post('/', verificarToken, upload.single('imagen'), crearServicio); 
router.put('/:id', verificarToken, upload.single('imagen'), actualizarServicio);
router.delete('/:id', verificarToken, eliminarServicio);

export default router;