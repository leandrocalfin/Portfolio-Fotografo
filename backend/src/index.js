import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { conectarDB } from './config/db.js';

// 1. IMPORTAMOS LAS RUTAS (Asegúrate de poner el .js al final)
import trabajoRoutes from './routes/trabajoRoutes.js'; 
import usuarioRoutes from './routes/usuarioRoutes.js'; 
import bcrypt from 'bcrypt'; 
import servicioRoutes from './routes/servicioRoutes.js';

// Agregamos las llaves a Usuario
import { Usuario } from './models/Usuario.js'; 

dotenv.config();

const app = express();

// 🔑 ESTO DEBE IR PRIMERO QUE NADA PARA EL PROXY DE RENDER
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

// CONECTAMOS LA BASE DE DATOS
conectarDB();

// 2. CONECTAMOS TODAS LAS RUTAS
app.use('/api/servicios', servicioRoutes);
app.use('/api/trabajos', trabajoRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.get('/', (req, res) => {
  res.send('📷 ¡El servidor del portfolio fotográfico está vivo y funcionando!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo a la perfección en http://localhost:${PORT}`);
});