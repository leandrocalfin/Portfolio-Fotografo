import { z } from 'zod';

export const crearTrabajoSchema = z.object({
  titulo: z.string({
    required_error: "El título es obligatorio."
  })
  .min(3, "El título debe tener al menos 3 caracteres.")
  .max(50, "El título no puede superar los 50 caracteres."),

  descripcion: z.string({
    required_error: "La descripción es obligatoria."
  })
  .min(10, "La descripción debe tener al menos 10 caracteres."),

  categoria: z.string({
    required_error: "La categoría es obligatoria."
  })
  .min(2, "La categoría debe ser válida."),

  fotos: z.array(
    z.string().url("Cada foto debe ser una URL válida de internet.")
  )
  .min(5, "Debes subir un mínimo de 5 fotos.")
  .max(7, "No puedes subir más de 7 fotos."),

  // 👇 ACÁ ESTÁ LA MAGIA PARA QUE SEA REALMENTE OPCIONAL 👇
  linkDrive: z.union([
    z.string()
      .url("El formato del enlace no es válido.")
      .includes("drive.google.com", { message: "Debe ser un enlace que apunte a Google Drive." }),
    z.literal('') // Acepta que el string venga completamente vacío
  ]).optional()
});