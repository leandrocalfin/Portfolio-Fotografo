import { z } from 'zod';

export const cambiarPasswordSchema = z.object({
  passwordActual: z.string({
    required_error: "La contraseña actual es obligatoria."
  }),
  passwordNueva: z.string({
    required_error: "La contraseña nueva es obligatoria."
  })
  .min(8, "Por seguridad, la nueva contraseña debe tener al menos 8 caracteres.")
});