import DOMPurify from 'isomorphic-dompurify';

export function sanitizeString(input: string): string {
  // Strip all HTML — we never want HTML in lead fields
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
}

export function sanitizeLeadFields<T extends Record<string, unknown>>(data: T): T {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    sanitized[key] = typeof value === 'string' ? sanitizeString(value) : value;
  }
  return sanitized as T;
}
