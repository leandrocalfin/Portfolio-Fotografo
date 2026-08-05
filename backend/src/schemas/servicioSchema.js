import { z } from 'zod';

export const servicioSchema = z.object({
  titulo: z.string({
    required_error: "El título es obligatorio"
  }).min(2, "El título es muy corto"),
  
  descripcion: z.string({
    required_error: "La descripción es obligatoria"
  }).min(5, "La descripción es muy corta"),
  
  link: z.string().optional()
});