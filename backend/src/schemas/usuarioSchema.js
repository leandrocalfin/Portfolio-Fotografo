import { z } from 'zod';

// ==========================================
// LOGIN
// ==========================================

export const loginSchema = z.object({

  email: z
    .string({
      required_error: 'El email es obligatorio.'
    })
    .trim()
    .email('El email no es válido.')
    .max(254, 'El email es demasiado largo.'),

  password: z
    .string({
      required_error: 'La contraseña es obligatoria.'
    })
    .min(1, 'La contraseña es obligatoria.')
    .max(128, 'La contraseña es demasiado larga.')

});


// ==========================================
// CAMBIAR CONTRASEÑA
// ==========================================

export const cambiarPasswordSchema = z.object({

  passwordActual: z
    .string({
      required_error: 'La contraseña actual es obligatoria.'
    })
    .min(1, 'La contraseña actual es obligatoria.')
    .max(128, 'La contraseña actual es demasiado larga.'),

  passwordNueva: z
    .string({
      required_error: 'La contraseña nueva es obligatoria.'
    })
    .min(
      10,
      'La nueva contraseña debe tener al menos 10 caracteres.'
    )
    .max(
      128,
      'La nueva contraseña no puede superar los 128 caracteres.'
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