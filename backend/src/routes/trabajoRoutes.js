import express from 'express';
import { 
  crearTrabajo, 
  obtenerTrabajos, 
  eliminarTrabajo, 
  actualizarTrabajo 
} from '../controllers/trabajoController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

// IMPORTAMOS NUESTRO MIDDLEWARE DE CLOUDINARY
import { uploadFotos } from '../config/cloudinary.js';

// Importamos el Modelo
import { Trabajo } from '../models/Trabajo.js';

const router = express.Router();

router.get('/', obtenerTrabajos); 

// RUTA PARA OBTENER UN SOLO TRABAJO POR SU ID
router.get('/:id', async (req, res) => {
  try {
    const trabajo = await Trabajo.findById(req.params.id);
    if (!trabajo) {
      return res.status(404).json({ mensaje: 'Trabajo no encontrado' });
    }
    res.json(trabajo);
  } catch (error) {
    console.error("Error al buscar el trabajo:", error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// POST: CREAR TRABAJO (Con inspector de fotos)
router.post('/', verificarToken, (req, res, next) => {
  uploadFotos.array('imagenes', 7)(req, res, (err) => {
    if (err) {
      console.error('🚨 ERROR DE MULTER/CLOUDINARY AL CREAR:', err);
      return res.status(500).json({ 
        mensaje: 'Error al subir las fotos a la nube', 
        detalle: err.message 
      });
    }
    next();
  });
}, crearTrabajo);      

// DELETE: ELIMINAR TRABAJO
router.delete('/:id', verificarToken, eliminarTrabajo);  

// PUT: ACTUALIZAR TRABAJO (¡AQUÍ FALTABA EL INSPECTOR!)
router.put('/:id', verificarToken, (req, res, next) => {
  // Usamos el mismo inspector que en el POST para atrapar fotos nuevas si las hay
  uploadFotos.array('imagenes', 7)(req, res, (err) => {
    if (err) {
      console.error('🚨 ERROR DE MULTER/CLOUDINARY AL EDITAR:', err);
      return res.status(500).json({ 
        mensaje: 'Error al subir las fotos nuevas a la nube', 
        detalle: err.message 
      });
    }
    next();
  });
}, actualizarTrabajo);   

export default router;