import { Router } from 'express';
import { obtenerServicios, crearServicio, actualizarServicio, eliminarServicio } from '../controllers/servicioController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { uploadFotos as upload } from '../config/cloudinary.js'; // O la ruta donde tengas tu configuración de multer/cloudinary

const router = Router();

router.get('/', obtenerServicios);
router.post('/', verificarToken, upload.single('imagen'), crearServicio);
router.put('/:id', verificarToken, upload.single('imagen'), actualizarServicio);
router.delete('/:id', verificarToken, eliminarServicio);

export default router;