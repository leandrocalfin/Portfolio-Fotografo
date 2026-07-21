import { v2 as cloudinary } from 'cloudinary'; // <-- NUEVO: Para poder borrar físicamente de la nube
import { Trabajo } from '../models/Trabajo.js';
import { crearTrabajoSchema } from '../schemas/trabajoSchema.js';

// ==========================================
// CREAR: Subir un nuevo trabajo
// ==========================================
export const crearTrabajo = async (req, res) => {
  try {
    const urlsFotosObtenidas = req.files ? req.files.map(archivo => archivo.path) : [];

    const datosRecibidos = {
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      categoria: req.body.categoria, // Agregado por si tenías la categoría acá
      linkDrive: req.body.linkDrive,
      fotos: urlsFotosObtenidas
    };

    const datosValidados = crearTrabajoSchema.parse(datosRecibidos);

    const nuevoTrabajo = new Trabajo(datosValidados);
    await nuevoTrabajo.save();

    res.status(201).json({
      mensaje: '¡Trabajo fotográfico creado y fotos subidas con éxito!',
      trabajo: nuevoTrabajo
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      const mensajesDeError = error.issues.map(issue => issue.message);
      return res.status(400).json({ errores: mensajesDeError });
    }
    console.error('Error al crear trabajo:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// ==========================================
// LEER: Obtener todos los trabajos (Con Paginación)
// ==========================================
export const obtenerTrabajos = async (req, res) => {
  try {
    // 1. Capturamos qué página quiere ver el usuario y cuántos por página.
    // Si no manda nada en la URL, asumimos por defecto: Página 1, Límite 10.
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 2. Calculamos cuántos documentos hay que "saltarse" (skip)
    // Ejemplo: Si estoy en la página 2 con límite de 10, me salto los primeros 10.
    const skip = (page - 1) * limit;

    // 3. Ejecutamos la búsqueda aplicando el salto y el límite
    const trabajos = await Trabajo.find()
      .sort({ fechaCreacion: -1 }) // Los más nuevos primero
      .skip(skip)
      .limit(limit);

    // 4. Contamos cuántos trabajos hay en TOTAL en la base de datos
    const totalTrabajos = await Trabajo.countDocuments();

    // 5. Devolvemos las fotos y un pequeño resumen (metadata) para ayudar al frontend
    res.status(200).json({
      trabajos, // Acá va el array con las fotos
      paginacion: {
        paginaActual: page,
        totalPaginas: Math.ceil(totalTrabajos / limit),
        totalTrabajos,
        limite: limit
      }
    });

  } catch (error) {
    console.error("Error al obtener trabajos:", error);
    res.status(500).json({ mensaje: 'Error interno al obtener los trabajos.' });
  }
};

// ==========================================
// ELIMINAR: Borrar un trabajo por su ID
// ==========================================
export const eliminarTrabajo = async (req, res) => {
  try {
    const { id } = req.params; 
    
    // Primero buscamos el trabajo para saber qué fotos borrar de la nube
    const trabajoAEliminar = await Trabajo.findById(id);
    if (!trabajoAEliminar) {
      return res.status(404).json({ mensaje: 'El trabajo no existe o ya fue eliminado.' });
    }

    // Borramos todas sus fotos de Cloudinary para no dejar basura
    if (trabajoAEliminar.fotos && trabajoAEliminar.fotos.length > 0) {
      for (const fotoUrl of trabajoAEliminar.fotos) {
        const match = fotoUrl.match(/\/v\d+\/(.+)\.\w+$/);
        if (match && match[1]) {
          await cloudinary.uploader.destroy(match[1]);
        }
      }
    }
    
    // Luego lo eliminamos de MongoDB
    await Trabajo.findByIdAndDelete(id);

    res.status(200).json({ mensaje: 'Trabajo eliminado correctamente de la base de datos y la nube.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al intentar eliminar el trabajo.' });
  }
};

// ==========================================
// ACTUALIZAR: Modificar un trabajo existente
// ==========================================
export const actualizarTrabajo = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, categoria, linkDrive } = req.body;

    // 1. Buscamos el trabajo original para saber qué fotos tenía antes
    const trabajoOriginal = await Trabajo.findById(id);
    if (!trabajoOriginal) {
      return res.status(404).json({ mensaje: 'Trabajo no encontrado' });
    }

    // 2. Obtenemos las fotos que el usuario NO borró (vienen del Frontend)
    let fotosExistentes = req.body.fotosExistentes || [];
    if (typeof fotosExistentes === 'string') {
      fotosExistentes = [fotosExistentes];
    }

    // 3. LIMPIEZA CLOUDINARY: Borramos de la nube las fotos que eliminaste con la "X"
    const fotosParaBorrar = (trabajoOriginal.fotos || []).filter(
      (fotoVieja) => !fotosExistentes.includes(fotoVieja)
    );

    for (const fotoUrl of fotosParaBorrar) {
      const match = fotoUrl.match(/\/v\d+\/(.+)\.\w+$/);
      if (match && match[1]) {
        await cloudinary.uploader.destroy(match[1]);
      }
    }

    // 4. Preparamos los textos para actualizar e iniciamos la lista de fotos
    const datosActualizados = {
      titulo,
      descripcion,
      categoria,
      linkDrive,
      fotos: fotosExistentes // Acá le decimos a MongoDB: "quedate solo con estas"
    };

    // 5. Si además vinieron archivos NUEVOS, los sumamos a la lista
    if (req.files && req.files.length > 0) {
      const nuevasFotos = req.files.map(file => file.path);
      datosActualizados.fotos = [...datosActualizados.fotos, ...nuevasFotos];
    }

    // 6. Finalmente actualizamos en MongoDB
    const trabajoActualizado = await Trabajo.findByIdAndUpdate(
      id, 
      datosActualizados, 
      { returnDocument: 'after' } // <--- ACÁ ESTÁ EL CAMBIO PARA QUITAR LA ADVERTENCIA
    );

    res.json(trabajoActualizado);

  } catch (error) {
    console.error("Error al actualizar:", error);
    res.status(500).json({ mensaje: 'Error al actualizar el trabajo' });
  }
};