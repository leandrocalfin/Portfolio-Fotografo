import express from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/usuarioController.js';

// 1. IMPORTAMOS EL ESCUDO
import { loginLimiter } from '../middlewares/limiter.js';

const router = express.Router();

router.post('/registro', registrarUsuario);

// 2. PONEMOS EL ESCUDO JUSTO ANTES DEL CONTROLADOR DE LOGIN
router.post('/login', loginLimiter, loginUsuario);

export default router;