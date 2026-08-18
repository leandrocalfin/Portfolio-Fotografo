import { z } from 'zod';

export const crearTrabajoSchema = z.object({

  titulo: z
    .string({
      required_error: 'El título es obligatorio.'
    })
    .trim()
    .min(
      3,
      'El título debe tener al menos 3 caracteres.'
    )
    .max(
      50,
      'El título no puede superar los 50 caracteres.'
    ),

  descripcion: z
    .string({
      required_error: 'La descripción es obligatoria.'
    })
    .trim()
    .min(
      10,
      'La descripción debe tener al menos 10 caracteres.'
    )
    .max(
      1000,
      'La descripción no puede superar los 1000 caracteres.'
    ),

  categoria: z
    .string({
      required_error: 'La categoría es obligatoria.'
    })
    .trim()
    .min(
      2,
      'La categoría debe ser válida.'
    )
    .max(
      50,
      'La categoría no puede superar los 50 caracteres.'
    ),

  fotos: z
    .array(
      z.string().url(
        'Cada foto debe ser una URL válida de internet.'
      )
    )
    .min(
      5,
      'Debes subir un mínimo de 5 fotos.'
    )
    .max(
      7,
      'No puedes subir más de 7 fotos.'
    ),

  linkDrive: z
    .union([
      z
        .string()
        .trim()
        .url(
          'El formato del enlace no es válido.'
        )
        .refine(
          (url) => {
            try {
              const parsedUrl = new URL(url);

              return (
                parsedUrl.protocol === 'https:' &&
                (
                  parsedUrl.hostname === 'drive.google.com' ||
                  parsedUrl.hostname === 'docs.google.com'
                )
              );
            } catch {
              return false;
            }
          },
          {
            message:
              'Debe ser un enlace válido de Google Drive.'
          }
        ),

      z.literal('')
    ])
    .optional()

});