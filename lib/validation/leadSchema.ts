import { z } from 'zod';

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'error_name_min')
    .max(100, 'error_name_max')
    .regex(/^[\p{L}\s\-\.]+$/u, 'error_name_invalid'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('error_email_invalid')
    .max(254, 'error_email_max'),
  phone: z.string().trim().max(30, 'error_phone_max').optional().or(z.literal('')),
  company: z.string().trim().max(150, 'error_company_max').optional().or(z.literal('')),
  project_type: z.enum(['saas', 'web', 'chatbot', 'integration', 'other'], {
    errorMap: () => ({ message: 'error_project_type_required' }),
  }),
  budget: z.enum(['<1M', '1-5M', '5-15M', '15M+', 'undecided'], {
    errorMap: () => ({ message: 'error_budget_required' }),
  }),
  message: z
    .string()
    .trim()
    .min(20, 'error_message_min')
    .max(2000, 'error_message_max'),
  honeypot: z.string().max(0),
  turnstile_token: z.string().min(1),
  locale: z.enum(['es', 'en']),
});

export type LeadFormInput = z.infer<typeof leadSchema>;
