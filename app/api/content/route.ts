import { NextRequest, NextResponse } from 'next/server';
import { updateContentSchema } from '@/lib/validation/contentSchema';
import { contentRateLimit, checkRateLimit } from '@/lib/security/rateLimit';
import { sanitizeString } from '@/lib/security/sanitize';
import { verifyAdminSession } from '@/lib/services/authService';
import { updateContent } from '@/lib/services/contentService';

const GENERIC_ERROR = { ok: false, error: 'generic' };

export async function PATCH(req: NextRequest) {
  try {
    // Auth check
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }

    // Rate limit per user
    const rateLimitResult = await checkRateLimit(contentRateLimit, `content:${session.userId}`);
    if (!rateLimitResult.success) {
      return NextResponse.json(GENERIC_ERROR, {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)) },
      });
    }

    // Validate input
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(GENERIC_ERROR, { status: 400 });
    }

    const parsed = updateContentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'validation', fields: parsed.error.flatten().fieldErrors },
        { status: 422 },
      );
    }

    const { id, locale, value } = parsed.data;
    const sanitizedValue = sanitizeString(value);

    await updateContent(id, locale, sanitizedValue, session.userId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/content] Unexpected error:', err instanceof Error ? err.message : 'unknown');
    return NextResponse.json(GENERIC_ERROR, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
