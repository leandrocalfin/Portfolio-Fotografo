import mongoose from 'mongoose';

export const conectarDB = async () => {
  try {
    // Verificamos que la variable exista
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI no está configurada.');
    }

    // Conectamos MongoDB usando exclusivamente
    // la variable de entorno del backend
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB conectado correctamente.');

  } catch (error) {
    // El detalle queda solamente en los logs del servidor
    console.error('Error al conectar con MongoDB:', error);

    // Si no podemos acceder a la base de datos,
    // no tiene sentido iniciar la API.
    process.exit(1);
  }
};