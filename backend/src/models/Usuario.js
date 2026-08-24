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
    Imagen del hero de la página de Inicio.
    Se guarda la URL de Cloudinary tras subirla.
    Si queda vacía, el frontend usa su imagen
    por defecto (/fondo.png).
  */
  fotoPortada: {
    type: String,
    default: ''
  },

  /*
    Punto focal de la portada, en porcentajes.
    Define qué parte de la imagen se ve en el hero
    (por ejemplo centrar el rostro del sujeto).
    x: 0 = borde izquierdo, 100 = borde derecho.
    y: 0 = borde superior, 100 = borde inferior.
  */
  portadaPosicion: {
    x: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    },
    y: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    }
  },

  /*
    Texto libre de la sección Sobre Mí.
    El frontend separa los párrafos por líneas
    vacías (doble salto de línea) para mostrarlo
    con el mismo formato que el diseño original.
    Vacío -> muestra un texto por defecto.
  */
  textoSobreMi: {
    type: String,
    default: '',
    maxlength: 5000
  },

  /*
    Titulo de la seccion Sobre Mi.
    Vacio -> el frontend muestra su titulo por defecto.
  */
  tituloSobreMi: {
    type: String,
    default: '',
    maxlength: 120
  },

  /*
    Imagen de la seccion Sobre Mi (URL de Cloudinary).
    Vacia -> el frontend usa su imagen por defecto.
  */
  fotoSobreMi: {
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