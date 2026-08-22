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
    required: [true, 'La contraseña es obligatoria.'],
    select: false
  },

  avatar: {
    type: String,
    default: ''
  },

  whatsapp: {
    type: String,
    default: ''
  },

  instagram: {
    type: String,
    default: ''
  },

  /*
    Versión de los tokens emitidos para este usuario.

    Cada JWT lleva copia de este número en su payload.
    Al incrementarlo (cambio de contraseña, logout),
    TODOS los JWT emitidos anteriormente quedan
    inválidos al instante, aunque su firma sea válida
    y no hayan expirado.

    Es lo que le da al JWT un botón de "revocar".
  */

  tokenVersion: {
    type: Number,
    default: 0
  }

});

// ==========================================
// 1. MIDDLEWARE: Hashear antes de guardar
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