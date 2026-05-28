// Strip all HTML — we never want HTML in lead/content fields.
// We don't use isomorphic-dompurify because its JSDOM dependency crashes
// at module-load time on Vercel's serverless runtime, taking down every
// API route that imports this file.
const TAG_RE = /<[^>]*>/g;

export function sanitizeString(input: string): string {
  return input.replace(TAG_RE, '').trim();
}

export function sanitizeLeadFields<T extends Record<string, unknown>>(data: T): T {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    sanitized[key] = typeof value === 'string' ? sanitizeString(value) : value;
  }
  return sanitized as T;
}
