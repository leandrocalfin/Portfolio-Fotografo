import express from 'express';
// 1. Importamos la nueva función del controlador
import { registrarUsuario, loginUsuario, cambiarPassword } from '../controllers/usuarioController.js';

// Importamos los escudos y validadores
import { loginLimiter } from '../middlewares/limiter.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { validarEsquema } from '../middlewares/validarZod.js';
import { cambiarPasswordSchema } from '../schemas/usuarioSchema.js';

const router = express.Router();

// ==========================================
// RUTAS PÚBLICAS
// ==========================================
router.post('/registro', registrarUsuario);
router.post('/login', loginLimiter, loginUsuario);

// ==========================================
// RUTAS PRIVADAS
// ==========================================
// 2. Armamos la ruta encadenando los middlewares en el orden correcto
router.put('/cambiar-password', 
  verificarToken, // Primero vemos si tiene permiso
  validarEsquema(cambiarPasswordSchema), // Después vemos si escribió bien las contraseñas
  cambiarPassword // Finalmente ejecutamos el cambio
);

export default router;