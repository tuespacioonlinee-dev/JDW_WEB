import { z } from 'zod';

export const updateContentSchema = z.object({
  id: z.string().trim().min(1).max(200),
  locale: z.enum(['es', 'en']),
  value: z.string().trim().min(1).max(5000),
});

export type UpdateContentInput = z.infer<typeof updateContentSchema>;
