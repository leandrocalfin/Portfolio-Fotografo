import mongoose from 'mongoose';

// Definimos el esquema (el molde) para un Trabajo fotográfico
const trabajoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio.'],
    trim: true // Borra espacios vacíos accidentales al inicio o final
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria.'],
    trim: true
  },
  // NUEVO: Agregamos el campo categoría
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria.'],
    trim: true
  },
  // Guardaremos un array de textos (las URLs de las imágenes que subirás a Cloudinary)
  fotos: {
    type: [String],
    required: [true, 'Las fotos son obligatorias.'],
    validate: {
      // Esta es una función validadora personalizada de Mongoose
      validator: function(array) {
        // Tu regla de oro: entre 5 y 7 fotos únicamente
        return array.length >= 5 && array.length <= 7;
      },
      message: 'Un trabajo debe tener obligatoriamente entre 5 y 7 fotos.'
    }
  },
  
  // 👇 EL CAMBIO ESTÁ ACÁ 👇
  linkDrive: {
    type: String,
    required: false, // Ahora Mongoose sabe que es opcional
    trim: true
  },
  
  fechaCreacion: {
    type: Date,
    default: Date.now // Guarda automáticamente el día y hora de creación
  }
});

// Exportamos el modelo para usarlo en nuestros controladores
export const Trabajo = mongoose.model('Trabajo', trabajoSchema);