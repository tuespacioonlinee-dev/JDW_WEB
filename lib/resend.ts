import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export type LeadNotificationData = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  project_type: string;
  budget: string;
  message: string;
  locale: string;
  created_at: string;
};

export function buildLeadEmailHtml(data: LeadNotificationData): string {
  return `
    <h2>Nuevo lead — JDC Developers</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px">
      <tr><td style="padding:8px;font-weight:bold">Nombre:</td><td style="padding:8px">${data.name}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">Email:</td><td style="padding:8px">${data.email}</td></tr>
      ${data.phone ? `<tr><td style="padding:8px;font-weight:bold">WhatsApp:</td><td style="padding:8px">${data.phone}</td></tr>` : ''}
      ${data.company ? `<tr><td style="padding:8px;font-weight:bold">Empresa:</td><td style="padding:8px">${data.company}</td></tr>` : ''}
      <tr><td style="padding:8px;font-weight:bold">Tipo:</td><td style="padding:8px">${data.project_type}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">Presupuesto:</td><td style="padding:8px">${data.budget}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">Idioma:</td><td style="padding:8px">${data.locale.toUpperCase()}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;vertical-align:top">Mensaje:</td><td style="padding:8px;white-space:pre-wrap">${data.message}</td></tr>
    </table>
    <p style="color:#666;font-size:12px">Recibido: ${data.created_at}</p>
    <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/leads" style="color:#7F77DD">Ver en panel admin →</a></p>
  `.trim();
}
