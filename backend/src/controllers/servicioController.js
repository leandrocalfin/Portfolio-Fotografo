import Servicio from '../models/Servicio.js';
import { v2 as cloudinary } from 'cloudinary';

export const obtenerServicios = async (req, res) => {
  try {
    const servicios = await Servicio.find().sort({ createdAt: -1 });
    res.json({ servicios });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los servicios", error: error.message });
  }
};

export const crearServicio = async (req, res) => {
  try {
    const { titulo, descripcion, link } = req.body;
    
    // Capturamos la URL de la imagen de forma segura contemplando distintas versiones de multer-storage
    let imagenUrl = "";
    if (req.file) {
      imagenUrl = req.file.path || req.file.secure_url || req.file.url;
    }

    const nuevoServicio = new Servicio({
      titulo,
      descripcion,
      imagen: imagenUrl,
      link: link || "#contacto"
    });

    const servicioGuardado = await nuevoServicio.save();
    res.status(201).json({ mensaje: "Servicio creado con éxito", servicio: servicioGuardado });
  } catch (error) {
    console.error("Error detallado al crear servicio:", error);
    res.status(500).json({ mensaje: "Error al crear el servicio", error: error.message });
  }
};

export const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, link, imagenExistente } = req.body;

    let imagenUrl = imagenExistente;
    if (req.file) {
      imagenUrl = req.file.path || req.file.secure_url || req.file.url;
    }

    const servicioActualizado = await Servicio.findByIdAndUpdate(
      id,
      { titulo, descripcion, imagen: imagenUrl, link },
      { new: true }
    );

    if (!servicioActualizado) {
      return res.status(404).json({ mensaje: "Servicio no encontrado" });
    }

    res.json({ mensaje: "Servicio actualizado con éxito", servicio: servicioActualizado });
  } catch (error) {
    console.error("Error detallado al actualizar servicio:", error);
    res.status(500).json({ mensaje: "Error al actualizar el servicio", error: error.message });
  }
};

export const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const servicioEliminado = await Servicio.findByIdAndDelete(id);

    if (!servicioEliminado) {
      return res.status(404).json({ mensaje: "Servicio no encontrado" });
    }

    res.json({ mensaje: "Servicio eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el servicio", error: error.message });
  }
};