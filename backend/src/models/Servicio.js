import mongoose from 'mongoose';

const servicioSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true
  },
  imagen: {
    type: String, // URL de Cloudinary o la plataforma que uses
    required: true
  },
  link: {
    type: String,
    default: "#contacto"
  }
}, {
  timestamps: true
});

export default mongoose.model('Servicio', servicioSchema);