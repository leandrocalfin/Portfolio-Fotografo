import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { conectarDB } from './config/db.js';

import trabajoRoutes from './routes/trabajoRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import servicioRoutes from './routes/servicioRoutes.js';

dotenv.config();

const app = express();

// ==========================================
// 1. PROXY
// ==========================================
// Render funciona detrás de un proxy.
// Esto permite que Express y express-rate-limit
// interpreten correctamente la IP del cliente.
app.set('trust proxy', 1);

// ==========================================
// 2. CABECERAS DE SEGURIDAD
// ==========================================
app.use(helmet());

// ==========================================
// 3. COOKIES
// ==========================================
app.use(cookieParser());

// ==========================================
// 4. CORS
// ==========================================
const origenesPermitidos = [
  process.env.FRONTEND_URL,
  'http://localhost:5173'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite herramientas sin cabecera Origin,
      // por ejemplo Postman o peticiones servidor-servidor.
      if (!origin) {
        return callback(null, true);
      }

      if (origenesPermitidos.includes(origin)) {
        return callback(null, true);
      }

      const error = new Error('Origen no permitido por CORS.');
      error.status = 403;
      return callback(error);
    },

    // Necesario para que el navegador envíe la cookie HttpOnly
    // entre el frontend y el backend.
    credentials: true,

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-CSRF-Token'
    ]
  })
);

// ==========================================
// 5. JSON
// ==========================================
app.use(
  express.json({
    limit: '100kb'
  })
);

// ==========================================
// 6. BASE DE DATOS
// ==========================================
conectarDB();

// ==========================================
// 7. RUTAS
// ==========================================
app.use('/api/servicios', servicioRoutes);
app.use('/api/trabajos', trabajoRoutes);
app.use('/api/usuarios', usuarioRoutes);

// ==========================================
// 8. HEALTH CHECK
// ==========================================
app.get('/', (req, res) => {
  res.status(200).json({
    mensaje: 'Servidor funcionando correctamente.'
  });
});

// ==========================================
// 9. RUTA NO ENCONTRADA
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    mensaje: 'Ruta no encontrada.'
  });
});

// ==========================================
// 10. MANEJO GLOBAL DE ERRORES
// ==========================================
app.use((error, req, res, next) => {
  console.error('ERROR DEL SERVIDOR:', error);

  const status = error.status || 500;

  res.status(status).json({
    mensaje:
      status === 403
        ? 'Origen no permitido.'
        : 'Error interno del servidor.'
  });
});

// ==========================================
// 11. INICIAR SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
