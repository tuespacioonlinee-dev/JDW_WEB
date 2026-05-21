import { z } from 'zod';

const urlOrEmpty = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === '' || /^https?:\/\/.+/.test(v), { message: 'URL inválida' });

const emailOrEmpty = z
  .string()
  .trim()
  .max(254)
  .refine((v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), { message: 'Email inválido' });

export const settingsSchema = z.object({
  contact_email: emailOrEmpty,
  contact_whatsapp: z.string().trim().max(50),
  contact_location: z.string().trim().max(150),
  social_github: urlOrEmpty,
  social_linkedin: urlOrEmpty,
  social_x: urlOrEmpty,
  calendly_url: urlOrEmpty,
});

export type SettingsInput = z.infer<typeof settingsSchema>;
