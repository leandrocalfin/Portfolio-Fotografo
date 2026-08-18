import mongoose from 'mongoose';

const servicioSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio.'],
      trim: true,
      minlength: [2, 'El título debe tener al menos 2 caracteres.'],
      maxlength: [60, 'El título no puede superar los 60 caracteres.']
    },

    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria.'],
      trim: true,
      minlength: [5, 'La descripción debe tener al menos 5 caracteres.'],
      maxlength: [500, 'La descripción no puede superar los 500 caracteres.']
    },

    imagen: {
      type: String,
      required: [true, 'La imagen es obligatoria.'],
      trim: true
    },

    link: {
      type: String,
      default: '#contacto',
      trim: true,
      maxlength: [500, 'El enlace es demasiado largo.']
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  'Servicio',
  servicioSchema
);