import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // <-- Importamos la librería de seguridad

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

// ==========================================
// 1. MIDDLEWARE: Encriptar antes de guardar
// ==========================================
usuarioSchema.pre('save', async function () {
  // Si la contraseña no fue modificada, cortamos la ejecución acá con un simple return
  if (!this.isModified('password')) {
    return; 
  }
  
  // Generamos el "salt" y la encriptamos
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  // Al usar async/await, Mongoose ya sabe cuándo terminamos. Chau next().
});

// ==========================================
// 2. MÉTODO: Comparar contraseñas en el login
// ==========================================
usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
  // Compara el string del login con el hash ilegible de la base de datos
  return await bcrypt.compare(passwordFormulario, this.password);
};

export const Usuario = mongoose.model('Usuario', usuarioSchema);