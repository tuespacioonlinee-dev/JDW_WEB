import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminLoginRateLimit, checkRateLimit } from '@/lib/security/rateLimit';
import { extractIp, hashIp } from '@/lib/security/hashIp';

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

    const adminEmail = getAdminAuthEmail();
    if (!adminEmail) {
      console.error('[admin/request-otp] ADMIN_EMAILS not configured');
      return NextResponse.json({ ok: false, error: 'generic' }, { status: 500 });
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: adminEmail,
      options: { shouldCreateUser: false },
    });

    if (error) {
      console.error('[admin/request-otp] signInWithOtp failed:', error.message);
      return NextResponse.json({ ok: false, error: 'generic' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/request-otp]', err instanceof Error ? err.message : 'unknown');
    return NextResponse.json({ ok: false, error: 'generic' }, { status: 500 });
  }
}
