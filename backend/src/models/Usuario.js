import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'El email es obligatorio.'],
    unique: true, // Crucial: Evita que se registren dos cuentas con el mismo correo
    trim: true,
    lowercase: true // Siempre guarda el correo en minúsculas para evitar errores
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria.']
  }
});

export const Usuario = mongoose.model('Usuario', usuarioSchema);