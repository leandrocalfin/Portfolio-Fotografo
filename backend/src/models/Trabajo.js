import mongoose from 'mongoose';

// ==========================================
// MODELO: TRABAJO FOTOGRÁFICO
// ==========================================

const trabajoSchema = new mongoose.Schema({

  titulo: {
    type: String,
    required: [true, 'El título es obligatorio.'],
    trim: true,
    minlength: [3, 'El título debe tener al menos 3 caracteres.'],
    maxlength: [50, 'El título no puede superar los 50 caracteres.']
  },

  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria.'],
    trim: true,
    minlength: [10, 'La descripción debe tener al menos 10 caracteres.'],
    maxlength: [1000, 'La descripción no puede superar los 1000 caracteres.']
  },

  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria.'],
    trim: true,
    minlength: [2, 'La categoría debe tener al menos 2 caracteres.'],
    maxlength: [50, 'La categoría no puede superar los 50 caracteres.']
  },

  fotos: {
    type: [String],
    required: [true, 'Las fotos son obligatorias.'],

    validate: {
      validator: function (array) {
        return (
          Array.isArray(array) &&
          array.length >= 5 &&
          array.length <= 7
        );
      },

      message:
        'Un trabajo debe tener obligatoriamente entre 5 y 7 fotos.'
    }
  },

  linkDrive: {
    type: String,
    required: false,
    trim: true,
    maxlength: [500, 'El enlace de Google Drive es demasiado largo.']
  },

  fechaCreacion: {
    type: Date,
    default: Date.now
  }

});

export const Trabajo = mongoose.model(
  'Trabajo',
  trabajoSchema
);