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
      'La nueva contraseA�a debe incluir al menos un sA­mbolo.'
    )

});


// ==========================================
// TEXTO SOBRE MI
// ==========================================

/*
  El texto se guarda tal cual, con sus saltos
  de linea. El frontend separa parrafos por
  lineas vacias. Limitamos a 5000 caracteres
  (unas ~2 paginas) para que nadie pueda
  guardar megas de texto en un solo campo.
*/

export const sobreMiSchema = z.object({

  textoSobreMi: z
    .string({
      required_error:
        'El texto es obligatorio.'
    })
    .trim()
    .min(
      1,
      'El texto no puede estar vacio.'
    )
    .max(
      5000,
      'El texto no puede superar los 5000 caracteres.'
    ),

  tituloSobreMi: z
    .string()
    .trim()
    .max(
      120,
      'El titulo no puede superar los 120 caracteres.'
    )
    .optional()
    .default('')

});


// ==========================================
// POSICION DE LA PORTADA (PUNTO FOCAL)
// ==========================================

/*
  Coordenadas en porcentaje del punto
  focal de la imagen de portada.
*/

export const portadaPosicionSchema = z.object({

  x: z
    .number({
      required_error: 'La posicion X es obligatoria.',
      invalid_type_error: 'La posicion X debe ser un numero.'
    })
    .min(0, 'La posicion X no puede ser menor a 0.')
    .max(100, 'La posicion X no puede superar 100.'),

  y: z
    .number({
      required_error: 'La posicion Y es obligatoria.',
      invalid_type_error: 'La posicion Y debe ser un numero.'
    })
    .min(0, 'La posicion Y no puede ser menor a 0.')
    .max(100, 'La posicion Y no puede superar 100.')

});