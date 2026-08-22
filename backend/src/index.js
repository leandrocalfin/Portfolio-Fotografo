import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { conectarDB } from './config/db.js';

import trabajoRoutes from './routes/trabajoRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import servicioRoutes from './routes/servicioRoutes.js';

import { limiterGlobal } from './middlewares/limiter.js';

dotenv.config();

const app = express();

// ==========================================
// 1. PROXY DE RENDER
// ==========================================

// Render funciona detrás de un proxy.
// Esto también ayuda a express-rate-limit
// a identificar correctamente la IP del cliente.
app.set('trust proxy', 1);

// ==========================================
// 2. CABECERAS DE SEGURIDAD
// ==========================================

app.use(helmet());

// ==========================================
// 3. COOKIES
// ==========================================

// Permite leer las cookies en:
// req.cookies
app.use(cookieParser());

// ==========================================
// 4. CORS
// ==========================================

// Permitimos:
// - frontend publicado en Vercel
// - frontend local de Vite
const origenesPermitidos = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      /*
        Algunas peticiones no traen Origin,
        por ejemplo Postman o comunicación
        servidor-servidor.
      */
      if (!origin) {
        return callback(null, true);
      }

      if (origenesPermitidos.includes(origin)) {
        return callback(null, true);
      }

      const error = new Error(
        'Origen no permitido por CORS.'
      );

      error.status = 403;

      return callback(error);
    },

    // MUY IMPORTANTE:
    // permite enviar la cookie HttpOnly
    // entre frontend y backend.
    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-CSRF-Token',
    ],
  })
);

// ==========================================
// 5. RATE LIMITER GLOBAL
// ==========================================

/*
  Aplica a TODAS las rutas. El login además
  tiene su propio limiter estricto dentro
  de usuarioRoutes (defensa en capas).
*/
app.use(limiterGlobal);

// ==========================================
// 6. JSON
// ==========================================

// Limitamos el tamaño del JSON recibido.
// Las imágenes pasan por Multer, no por esto.
app.use(
  express.json({
    limit: '100kb',
  })
);

// ==========================================
// 7. BASE DE DATOS
// ==========================================

conectarDB();

// ==========================================
// 8. RUTAS
// ==========================================

app.use(
  '/api/servicios',
  servicioRoutes
);

app.use(
  '/api/trabajos',
  trabajoRoutes
);

app.use(
  '/api/usuarios',
  usuarioRoutes
);

// ==========================================
// 9. HEALTH CHECK
// ==========================================

app.get('/', (req, res) => {
  return res.status(200).json({
    mensaje:
      'Servidor funcionando correctamente.',
  });
});

// ==========================================
// 10. RUTA INEXISTENTE
// ==========================================

app.use((req, res) => {
  return res.status(404).json({
    mensaje: 'Ruta no encontrada.',
  });
});

// ==========================================
// 11. MANEJO GLOBAL DE ERRORES
// ==========================================

app.use((error, req, res, next) => {
  console.error(
    'ERROR DEL SERVIDOR:',
    error
  );

  const status =
    error.status || 500;

  if (status === 403) {
    return res.status(403).json({
      mensaje:
        'Origen no permitido.',
    });
  }

  return res.status(status).json({
    mensaje:
      'Error interno del servidor.',
  });
});

// ==========================================
// 12. INICIAR SERVIDOR
// ==========================================

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Servidor iniciado en el puerto ${PORT}`
  );
});