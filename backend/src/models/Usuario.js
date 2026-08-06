import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'El email es obligatorio.'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria.']
  },
  avatar: {
    type: String,
    default: '' // Guarda la URL de la imagen (por ejemplo, en Cloudinary)
  },
  whatsapp: { 
    type: String, 
    default: '' }, // Número o link de WhatsApp
  instagram: { 
    type: String, 
    default: '' } // Link o usuario de Instagram
});

// ==========================================
// 1. MIDDLEWARE: Encriptar antes de guardar
// ==========================================
usuarioSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ==========================================
// 2. MÉTODO: Comparar contraseñas en el login
// ==========================================
usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
  return await bcrypt.compare(passwordFormulario, this.password);
};

export const Usuario = mongoose.model('Usuario', usuarioSchema);