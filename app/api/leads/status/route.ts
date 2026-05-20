import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdminSession } from '@/lib/services/authService';
import { updateLeadStatus } from '@/lib/services/leadService';

const schema = z.object({
  id: z.string().uuid(),
  status: z.enum(['new', 'contacted', 'won', 'lost']),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'validation' }, { status: 422 });
    }

    await updateLeadStatus(parsed.data.id, parsed.data.status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/leads/status]', err instanceof Error ? err.message : 'unknown');
    return NextResponse.json({ ok: false, error: 'generic' }, { status: 500 });
  }
}
