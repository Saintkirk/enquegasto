import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string({ required_error: 'El correo es obligatorio' })
    .trim()
    .toLowerCase()
    .email('Ingresa un correo válido'),
  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña es demasiado larga')
    .regex(/[A-Za-z]/, 'La contraseña debe incluir al menos una letra')
    .regex(/[0-9]/, 'La contraseña debe incluir al menos un número'),
  name: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(80)
    .optional(),
  liquidSalary: z
    .union([
      z.number(),
      z.string().transform((val, ctx) => {
        const cleaned = val.replace(/[.\s]/g, '').replace(',', '.');
        const num = Number(cleaned);
        if (isNaN(num)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'El sueldo debe ser un número válido' });
          return z.NEVER;
        }
        return Math.round(num);
      }),
    ])
    .pipe(
      z
        .number()
        .int()
        .min(150_000, 'El sueldo líquido mínimo razonable es $150.000')
        .max(50_000_000)
    )
    .optional(),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'El correo es obligatorio' })
    .trim()
    .toLowerCase()
    .email('Ingresa un correo válido'),
  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(1, 'La contraseña es obligatoria')
    .max(100),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
