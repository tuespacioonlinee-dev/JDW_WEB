import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { adminLoginRateLimit, checkRateLimit } from '@/lib/security/rateLimit';
import { extractIp, hashIp } from '@/lib/security/hashIp';

const schema = z.object({
  code: z.string().regex(/^\d{6}$/),
});

function getAdminAuthEmail(): string | null {
  const emails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return emails[0] ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const ip = extractIp(req);
    const rl = await checkRateLimit(adminLoginRateLimit, hashIp(ip));
    if (!rl.success) {
      return NextResponse.json({ ok: false, error: 'rate_limit' }, { status: 429 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'invalid_code' }, { status: 422 });
    }

    const adminEmail = getAdminAuthEmail();
    if (!adminEmail) {
      return NextResponse.json({ ok: false, error: 'generic' }, { status: 500 });
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      email: adminEmail,
      token: parsed.data.code,
      type: 'email',
    });

    if (error) {
      console.warn('[admin/verify-otp] verify failed:', error.message);
      return NextResponse.json({ ok: false, error: 'invalid_code' }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/verify-otp]', err instanceof Error ? err.message : 'unknown');
    return NextResponse.json({ ok: false, error: 'generic' }, { status: 500 });
  }
}
