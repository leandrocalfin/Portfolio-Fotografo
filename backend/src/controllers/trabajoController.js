import { v2 as cloudinary } from 'cloudinary';

import { Trabajo } from '../models/Trabajo.js';
import { crearTrabajoSchema } from '../schemas/trabajoSchema.js';

// ==========================================
// FUNCIÓN AUXILIAR
// Obtener public_id de una URL de Cloudinary
// ==========================================
const obtenerPublicIdCloudinary = (fotoUrl) => {
  try {
    const match = fotoUrl.match(/\/v\d+\/(.+)\.[a-zA-Z0-9]+$/);

    if (match && match[1]) {
      return match[1];
    }

    return null;
  } catch {
    return null;
  }
};


// ==========================================
// 1. CREAR TRABAJO
// ==========================================
export const crearTrabajo = async (req, res) => {
  try {
    const urlsFotosObtenidas = Array.isArray(req.files)
      ? req.files.map((archivo) => archivo.path)
      : [];

    const datosRecibidos = {
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      categoria: req.body.categoria,
      linkDrive: req.body.linkDrive,
      fotos: urlsFotosObtenidas
    };

    // Validamos antes de guardar
    const datosValidados = crearTrabajoSchema.parse(
      datosRecibidos
    );

    const nuevoTrabajo = new Trabajo(
      datosValidados
    );

    await nuevoTrabajo.save();

    return res.status(201).json({
      mensaje: 'Trabajo fotográfico creado correctamente.',
      trabajo: nuevoTrabajo
    });

  } catch (error) {

    // ==========================================
    // ERROR DE ZOD
    // ==========================================
    if (error.name === 'ZodError') {
      return res.status(400).json({
        mensaje: 'Los datos enviados no son válidos.',
        errores: error.issues.map(
          (issue) => issue.message
        )
      });
    }

    console.error(
      'ERROR AL CREAR TRABAJO:',
      error
    );

    return res.status(500).json({
      mensaje: 'Error interno del servidor.'
    });
  }
};


// ==========================================
// 2. OBTENER TODOS LOS TRABAJOS
// Con paginación
// ==========================================
export const obtenerTrabajos = async (req, res) => {
  try {

    // Página mínima: 1
    const page = Math.max(
      parseInt(req.query.page, 10) || 1,
      1
    );

    // Límite solicitado por el cliente
    const limitSolicitado =
      parseInt(req.query.limit, 10) || 10;

    // Nunca menos de 1 ni más de 50
    const limit = Math.min(
      Math.max(limitSolicitado, 1),
      50
    );

    const skip = (page - 1) * limit;

    const trabajos = await Trabajo
      .find()
      .sort({
        fechaCreacion: -1
      })
      .skip(skip)
      .limit(limit);

    const totalTrabajos =
      await Trabajo.countDocuments();

    return res.status(200).json({
      trabajos,

      paginacion: {
        paginaActual: page,
        totalPaginas: Math.ceil(
          totalTrabajos / limit
        ),
        totalTrabajos,
        limite: limit
      }
    });

  } catch (error) {

    console.error(
      'ERROR AL OBTENER TRABAJOS:',
      error
    );

    return res.status(500).json({
      mensaje:
        'Error interno al obtener los trabajos.'
    });
  }
};


// ==========================================
// 3. ELIMINAR TRABAJO
// ==========================================
export const eliminarTrabajo = async (req, res) => {
  try {
    const { id } = req.params;

    // Primero buscamos el trabajo
    const trabajoAEliminar =
      await Trabajo.findById(id);

    if (!trabajoAEliminar) {
      return res.status(404).json({
        mensaje:
          'El trabajo no existe o ya fue eliminado.'
      });
    }

    // ==========================================
    // ELIMINAR DOCUMENTO DE MONGODB
    // ==========================================

    await Trabajo.findByIdAndDelete(id);

    // ==========================================
    // LIMPIAR FOTOS DE CLOUDINARY
    // ==========================================

    if (
      Array.isArray(trabajoAEliminar.fotos) &&
      trabajoAEliminar.fotos.length > 0
    ) {

      for (
        const fotoUrl of trabajoAEliminar.fotos
      ) {

        try {

          const publicId =
            obtenerPublicIdCloudinary(fotoUrl);

          if (publicId) {
            await cloudinary.uploader.destroy(
              publicId
            );
          }

        } catch (errorCloudinary) {

          // Si Cloudinary falla, no exponemos
          // el error al usuario.
          console.error(
            'ERROR AL BORRAR FOTO DE CLOUDINARY:',
            errorCloudinary
          );
        }
      }
    }

    return res.status(200).json({
      mensaje:
        'Trabajo eliminado correctamente.'
    });

  } catch (error) {

    console.error(
      'ERROR AL ELIMINAR TRABAJO:',
      error
    );

    return res.status(500).json({
      mensaje:
        'Error al intentar eliminar el trabajo.'
    });
  }
};


// ==========================================
// 4. ACTUALIZAR TRABAJO
// ==========================================
export const actualizarTrabajo = async (req, res) => {
  try {

    const { id } = req.params;

    // ==========================================
    // BUSCAR TRABAJO ORIGINAL
    // ==========================================

    const trabajoOriginal =
      await Trabajo.findById(id);

    if (!trabajoOriginal) {
      return res.status(404).json({
        mensaje: 'Trabajo no encontrado.'
      });
    }

    // ==========================================
    // FOTOS EXISTENTES
    // ==========================================

    let fotosExistentes =
      req.body.fotosExistentes || [];

    // Cuando FormData manda una sola foto,
    // puede llegar como string en lugar de array.
    if (
      typeof fotosExistentes === 'string'
    ) {
      fotosExistentes = [
        fotosExistentes
      ];
    }

    // Nos aseguramos de trabajar con un array
    if (
      !Array.isArray(fotosExistentes)
    ) {
      fotosExistentes = [];
    }

    // ==========================================
    // FOTOS NUEVAS
    // ==========================================

    const nuevasFotos =
      Array.isArray(req.files)
        ? req.files.map(
            (archivo) => archivo.path
          )
        : [];

    // ==========================================
    // DATOS PARA ACTUALIZAR
    // ==========================================

    const datosActualizados = {
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      categoria: req.body.categoria,
      linkDrive: req.body.linkDrive,

      fotos: [
        ...fotosExistentes,
        ...nuevasFotos
      ]
    };

    // ==========================================
    // VALIDAR CON ZOD
    // ==========================================

    const datosValidados =
      crearTrabajoSchema.parse(
        datosActualizados
      );

    // ==========================================
    // DETECTAR FOTOS ELIMINADAS
    // ==========================================

    const fotosParaBorrar =
      (trabajoOriginal.fotos || []).filter(
        (fotoVieja) =>
          !fotosExistentes.includes(
            fotoVieja
          )
      );

    // ==========================================
    // ACTUALIZAR MONGODB
    // ==========================================

    const trabajoActualizado =
      await Trabajo.findByIdAndUpdate(
        id,

        datosValidados,

        {
          new: true,
          runValidators: true
        }
      );

    // ==========================================
    // BORRAR FOTOS ELIMINADAS DE CLOUDINARY
    // ==========================================

    for (
      const fotoUrl of fotosParaBorrar
    ) {

      try {

        const publicId =
          obtenerPublicIdCloudinary(
            fotoUrl
          );

        if (publicId) {

          await cloudinary
            .uploader
            .destroy(publicId);
        }

      } catch (errorCloudinary) {

        console.error(
          'ERROR AL BORRAR FOTO DE CLOUDINARY:',
          errorCloudinary
        );
      }
    }

    return res.status(200).json({
      mensaje:
        'Trabajo actualizado correctamente.',

      trabajo:
        trabajoActualizado
    });

  } catch (error) {

    // ==========================================
    // ERROR DE ZOD
    // ==========================================

    if (error.name === 'ZodError') {

      return res.status(400).json({
        mensaje:
          'Los datos enviados no son válidos.',

        errores:
          error.issues.map(
            (issue) => issue.message
          )
      });
    }

    console.error(
      'ERROR AL ACTUALIZAR TRABAJO:',
      error
    );

    return res.status(500).json({
      mensaje:
        'Error interno del servidor.'
    });
  }
};