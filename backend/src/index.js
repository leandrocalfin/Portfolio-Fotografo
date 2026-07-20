import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { conectarDB } from './config/db.js';

// 1. IMPORTAMOS LAS RUTAS (Asegúrate de poner el .js al final)
import trabajoRoutes from './routes/trabajoRoutes.js'; 
import usuarioRoutes from './routes/usuarioRoutes.js'; 
import bcrypt from 'bcrypt'; 

// 👇 CORRECCIÓN AQUÍ: Agregamos las llaves a Usuario
import { Usuario } from './models/Usuario.js'; 

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

conectarDB();

// RUTA TEMPORAL PARA CREAR AL ADMIN (BORRAR DESPUÉS)
app.get('/api/crear-admin-secreto', async (req, res) => {
  try {
    const adminExiste = await Usuario.findOne({ email: 'admin@studiovision.com' });
    if (adminExiste) {
      return res.send('El administrador ya existe en la base de datos.');
    }

    // Le pasamos la contraseña en texto normal, ¡el modelo se encarga de encriptarla!
    const nuevoAdmin = new Usuario({
      email: 'admin@studiovision.com',
      password: 'admin123' 
    });
    
    await nuevoAdmin.save();
    res.send('¡Administrador creado con éxito! Email: admin@studiovision.com | Pass: admin123');
  } catch (error) {
    res.send('Error al crear: ' + error.message);
  }
});

// 2. CONECTAMOS LAS RUTAS
app.use('/api/trabajos', trabajoRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.get('/', (req, res) => {
  res.send('📷 ¡El servidor del portfolio fotográfico está vivo y funcionando!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo a la perfección en http://localhost:${PORT}`);
});