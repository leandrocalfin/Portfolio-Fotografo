import Servicio from '../models/Servicio.js';
import { v2 as cloudinary } from 'cloudinary';

import { servicioSchema } from '../schemas/servicioSchema.js';

// ==========================================
// FUNCIÓN AUXILIAR
// Obtener public_id desde una URL de Cloudinary
// ==========================================
const obtenerPublicIdCloudinary = (imagenUrl) => {
  try {
    const match = imagenUrl.match(
      /\/v\d+\/(.+)\.[a-zA-Z0-9]+$/
    );

    if (match && match[1]) {
      return match[1];
    }

    return null;
  } catch {
    return null;
  }
};


// ==========================================
// 1. OBTENER SERVICIOS
// ==========================================
export const obtenerServicios = async (req, res) => {
  try {
    const servicios = await Servicio
      .find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      servicios
    });

  } catch (error) {
    console.error(
      'ERROR AL OBTENER SERVICIOS:',
      error
    );

    return res.status(500).json({
      mensaje: 'Error interno del servidor.'
    });
  }
};


// ==========================================
// 2. CREAR SERVICIO
// ==========================================
export const crearServicio = async (req, res) => {
  try {
    let imagenUrl = '';

    if (req.file) {
      imagenUrl =
        req.file.path ||
        req.file.secure_url ||
        req.file.url ||
        '';
    }

    const datosRecibidos = {
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      imagen: imagenUrl,
      link: req.body.link || '#contacto'
    };

    // Validación antes de guardar
    const datosValidados =
      servicioSchema.parse(datosRecibidos);

    const nuevoServicio = new Servicio(
      datosValidados
    );

    const servicioGuardado =
      await nuevoServicio.save();

    return res.status(201).json({
      mensaje: 'Servicio creado con éxito.',
      servicio: servicioGuardado
    });

  } catch (error) {

    if (error.name === 'ZodError') {
      return res.status(400).json({
        mensaje: 'Los datos enviados no son válidos.',
        errores: error.issues.map(
          (issue) => issue.message
        )
      });
    }

    console.error(
      'ERROR AL CREAR SERVICIO:',
      error
    );

    return res.status(500).json({
      mensaje: 'Error interno del servidor.'
    });
  }
};


// ==========================================
// 3. ACTUALIZAR SERVICIO
// ==========================================
export const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscamos primero el servicio original
    const servicioOriginal =
      await Servicio.findById(id);

    if (!servicioOriginal) {
      return res.status(404).json({
        mensaje: 'Servicio no encontrado.'
      });
    }

    let imagenUrl =
      req.body.imagenExistente ||
      servicioOriginal.imagen ||
      '';

    // Si se sube una imagen nueva,
    // reemplazamos la anterior.
    if (req.file) {
      imagenUrl =
        req.file.path ||
        req.file.secure_url ||
        req.file.url ||
        '';
    }

    const datosRecibidos = {
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      imagen: imagenUrl,
      link: req.body.link || '#contacto'
    };

    const datosValidados =
      servicioSchema.parse(datosRecibidos);

    const imagenAnterior =
      servicioOriginal.imagen;

    const servicioActualizado =
      await Servicio.findByIdAndUpdate(
        id,
        datosValidados,
        {
          new: true,
          runValidators: true
        }
      );

    // Si había una imagen anterior y se cambió,
    // intentamos eliminarla de Cloudinary.
    if (
      req.file &&
      imagenAnterior &&
      imagenAnterior !== imagenUrl
    ) {
      try {
        const publicId =
          obtenerPublicIdCloudinary(
            imagenAnterior
          );

        if (publicId) {
          await cloudinary.uploader.destroy(
            publicId
          );
        }

      } catch (errorCloudinary) {
        console.error(
          'ERROR AL BORRAR IMAGEN ANTERIOR DE CLOUDINARY:',
          errorCloudinary
        );
      }
    }

    return res.status(200).json({
      mensaje: 'Servicio actualizado con éxito.',
      servicio: servicioActualizado
    });

  } catch (error) {

    if (error.name === 'ZodError') {
      return res.status(400).json({
        mensaje: 'Los datos enviados no son válidos.',
        errores: error.issues.map(
          (issue) => issue.message
        )
      });
    }

    console.error(
      'ERROR AL ACTUALIZAR SERVICIO:',
      error
    );

    return res.status(500).json({
      mensaje: 'Error interno del servidor.'
    });
  }
};


// ==========================================
// 4. ELIMINAR SERVICIO
// ==========================================
export const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;

    const servicio =
      await Servicio.findById(id);

    if (!servicio) {
      return res.status(404).json({
        mensaje: 'Servicio no encontrado.'
      });
    }

    const imagenUrl =
      servicio.imagen;

    await Servicio.findByIdAndDelete(id);

    // Intentamos limpiar también la imagen
    // de Cloudinary.
    if (imagenUrl) {
      try {
        const publicId =
          obtenerPublicIdCloudinary(
            imagenUrl
          );

        if (publicId) {
          await cloudinary.uploader.destroy(
            publicId
          );
        }

      } catch (errorCloudinary) {
        console.error(
          'ERROR AL BORRAR IMAGEN DE CLOUDINARY:',
          errorCloudinary
        );
      }
    }

    return res.status(200).json({
      mensaje: 'Servicio eliminado correctamente.'
    });

  } catch (error) {
    console.error(
      'ERROR AL ELIMINAR SERVICIO:',
      error
    );

    return res.status(500).json({
      mensaje: 'Error interno del servidor.'
    });
  }
};