import { z } from 'zod';

export const servicioSchema = z.object({

  titulo: z
    .string({
      required_error: 'El título es obligatorio.'
    })
    .trim()
    .min(
      2,
      'El título debe tener al menos 2 caracteres.'
    )
    .max(
      60,
      'El título no puede superar los 60 caracteres.'
    ),

  descripcion: z
    .string({
      required_error: 'La descripción es obligatoria.'
    })
    .trim()
    .min(
      5,
      'La descripción debe tener al menos 5 caracteres.'
    )
    .max(
      500,
      'La descripción no puede superar los 500 caracteres.'
    ),

  imagen: z
    .string({
      required_error: 'La imagen es obligatoria.'
    })
    .url(
      'La imagen debe tener una URL válida.'
    ),

  link: z
    .string()
    .trim()
    .max(
      500,
      'El enlace es demasiado largo.'
    )
    .optional()

});