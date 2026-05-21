import { z } from 'zod';

export const caseMetricSchema = z.object({
  label_es: z.string().trim().max(60),
  label_en: z.string().trim().max(60),
});

export const caseStudySchema = z.object({
  name: z.string().trim().min(1).max(120),
  category_es: z.string().trim().max(80),
  category_en: z.string().trim().max(80),
  description_es: z.string().trim().max(1000),
  description_en: z.string().trim().max(1000),
  metrics: z.array(caseMetricSchema).max(6),
  image_url: z.string().trim().url().max(1000).nullable(),
  color: z.enum(['teal', 'purple', 'coral', 'pink']),
  display_order: z.number().int().min(0).max(9999),
  published: z.boolean(),
});

export const updateCaseStudySchema = caseStudySchema.extend({
  id: z.string().uuid(),
});

export type CaseStudyInput = z.infer<typeof caseStudySchema>;
export type UpdateCaseStudyInput = z.infer<typeof updateCaseStudySchema>;
