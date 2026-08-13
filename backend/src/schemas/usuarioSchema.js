import { z } from 'zod';

export const cambiarPasswordSchema = z.object({
  passwordActual: z
    .string({
      required_error: 'La contraseña actual es obligatoria.'
    })
    .min(1, 'La contraseña actual es obligatoria.'),

  passwordNueva: z
    .string({
      required_error: 'La contraseña nueva es obligatoria.'
    })
    .min(
      10,
      'La nueva contraseña debe tener al menos 10 caracteres.'
    )
    .regex(
      /[a-z]/,
      'La nueva contraseña debe incluir al menos una letra minúscula.'
    )
    .regex(
      /[A-Z]/,
      'La nueva contraseña debe incluir al menos una letra mayúscula.'
    )
    .regex(
      /[0-9]/,
      'La nueva contraseña debe incluir al menos un número.'
    )
    .regex(
      /[^A-Za-z0-9]/,
      'La nueva contraseña debe incluir al menos un símbolo.'
    )
});