import mongoose from 'mongoose';

export const conectarDB = async () => {
  try {
    // Intentamos conectarnos usando la variable de entorno
    const conexion = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`🔌 MongoDB Conectado con éxito: ${conexion.connection.host}`);
  } catch (error) {
    console.error(`❌ Error al conectar a la base de datos: ${error.message}`);
    // Si la base de datos no conecta, detenemos la aplicación inmediatamente
    process.exit(1);
  }
};