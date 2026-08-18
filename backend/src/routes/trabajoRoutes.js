import express from 'express';

import {
  crearTrabajo,
  obtenerTrabajos,
  eliminarTrabajo,
  actualizarTrabajo
} from '../controllers/trabajoController.js';

import { verificarToken } from '../middlewares/authMiddleware.js';
import { uploadFotos } from '../config/cloudinary.js';
import { Trabajo } from '../models/Trabajo.js';

const router = express.Router();

// ==========================================
// MIDDLEWARE PARA SUBIDA DE IMÁGENES
// ==========================================

const subirImagenesTrabajo = (req, res, next) => {
  uploadFotos.array('imagenes', 7)(
    req,
    res,
    (err) => {
      if (err) {
        console.error(
          'ERROR AL SUBIR IMÁGENES:',
          err
        );

        return res.status(400).json({
          mensaje:
            'No se pudieron procesar las imágenes.'
        });
      }

      next();
    }
  );
};

// ==========================================
// RUTAS PÚBLICAS
// ==========================================

// Obtener todos los trabajos
router.get(
  '/',
  obtenerTrabajos
);

// Obtener un trabajo por ID
router.get(
  '/:id',
  async (req, res) => {
    try {
      const trabajo =
        await Trabajo.findById(
          req.params.id
        );

      if (!trabajo) {
        return res.status(404).json({
          mensaje:
            'Trabajo no encontrado.'
        });
      }

      return res
        .status(200)
        .json(trabajo);

    } catch (error) {
      console.error(
        'ERROR AL BUSCAR TRABAJO:',
        error
      );

      return res.status(500).json({
        mensaje:
          'Error interno del servidor.'
      });
    }
  }
);

// ==========================================
// RUTAS PRIVADAS
// Requieren JWT Bearer válido
// ==========================================

// Crear trabajo
router.post(
  '/',
  verificarToken,
  subirImagenesTrabajo,
  crearTrabajo
);

// Actualizar trabajo
router.put(
  '/:id',
  verificarToken,
  subirImagenesTrabajo,
  actualizarTrabajo
);

// Eliminar trabajo
router.delete(
  '/:id',
  verificarToken,
  eliminarTrabajo
);

export default router;