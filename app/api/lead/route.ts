import { NextRequest, NextResponse } from 'next/server';
import { leadSchema } from '@/lib/validation/leadSchema';
import { leadRateLimit, checkRateLimit } from '@/lib/security/rateLimit';
import { verifyTurnstile } from '@/lib/security/turnstile';
import { sanitizeLeadFields } from '@/lib/security/sanitize';
import { createLead } from '@/lib/services/leadService';
import { extractIp, hashIp } from '@/lib/security/hashIp';

const GENERIC_ERROR = { ok: false, error: 'generic' };

export async function POST(req: NextRequest) {
  const ip = extractIp(req);
  const hashedIpForLog = hashIp(ip);

  try {
    // CAPA 2 — Rate limit by IP
    const rateLimitResult = await checkRateLimit(leadRateLimit, `lead:${hashedIpForLog}`);
    if (!rateLimitResult.success) {
      console.warn(`[api/lead] Rate limit exceeded ip=${hashedIpForLog}`);
      return NextResponse.json(
        { ok: false, error: 'rate_limit' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)),
          },
        },
      );
    }

    // CAPA 3 — Validate input with Zod
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(GENERIC_ERROR, { status: 400 });
    }

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      console.warn(`[api/lead] Validation failed ip=${hashedIpForLog}`);
      return NextResponse.json(
        { ok: false, error: 'validation', fields: parsed.error.flatten().fieldErrors },
        { status: 422 },
      );
    }

    const data = parsed.data;

    // CAPA 6 — Honeypot check (bot detection)
    if (data.honeypot !== '') {
      console.info(`[api/lead] Honeypot triggered ip=${hashedIpForLog}`);
      // Fake success — don't reveal we detected it
      return NextResponse.json({ ok: true });
    }

    // CAPA 6 — Turnstile verification
    const turnstileResult = await verifyTurnstile(data.turnstile_token, ip);
    if (!turnstileResult.success) {
      console.warn(`[api/lead] Turnstile failed ip=${hashedIpForLog} codes=${turnstileResult.errorCodes.join(',')}`);
      return NextResponse.json(GENERIC_ERROR, { status: 400 });
    }

    // CAPA 3 — Sanitize strings before DB
    const sanitized = sanitizeLeadFields({
      name: data.name,
      email: data.email,
      phone: data.phone ?? '',
      company: data.company ?? '',
      message: data.message,
    });

    // Call domain service
    const userAgent = req.headers.get('user-agent') ?? '';
    const { id } = await createLead(
      {
        name: sanitized.name,
        email: sanitized.email,
        phone: sanitized.phone || undefined,
        company: sanitized.company || undefined,
        project_type: data.project_type,
        budget: data.budget,
        message: sanitized.message,
        locale: data.locale,
        ip_hash: hashedIpForLog,
        user_agent: userAgent.slice(0, 500),
      },
      ip,
    );

    console.info(`[api/lead] Lead created id=${id} type=${data.project_type} locale=${data.locale}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/lead] Unexpected error:', err instanceof Error ? err.message : 'unknown');
    return NextResponse.json(GENERIC_ERROR, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
