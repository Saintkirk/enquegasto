import { z } from 'zod';

const billingCycleEnum = z.enum(['monthly', 'yearly', 'weekly', 'custom', 'MONTHLY', 'YEARLY', 'WEEKLY', 'OTHER'], {
  errorMap: () => ({ message: 'Ciclo inválido' }),
});

export const createSubscriptionSchema = z.object({
  name: z.string().trim().min(1).max(100),
  amount: z
    .union([
      z.number(),
      z.string().transform((val, ctx) => {
        const cleaned = val.replace(/[.\s]/g, '').replace(',', '.');
        const num = Number(cleaned);
        if (isNaN(num)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Monto inválido' });
          return z.NEVER;
        }
        return Math.round(num);
      }),
    ])
    .pipe(z.number().int().min(0).max(10_000_000)),
  billingCycle: billingCycleEnum.default('monthly'),
  platformId: z.string().optional().nullable(),
  platformSlug: z.string().optional().nullable(),
  nextBillingDate: z.string().optional().nullable(),
  startDate: z.string().optional(),
  notes: z.string().max(500).optional().nullable(),
  usageFrequency: z.enum(['daily', 'weekly', 'monthly', 'rarely', 'never']).optional(),
});

export const updateSubscriptionSchema = createSubscriptionSchema.partial().extend({
  isActive: z.boolean().optional(),
  isZombie: z.boolean().optional(),
  lastUsedAt: z.string().optional().nullable(),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
