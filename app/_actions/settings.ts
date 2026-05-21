'use server';

import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '@/lib/services/authService';
import { adminWriteRateLimit, checkRateLimit } from '@/lib/security/rateLimit';
import { settingsSchema } from '@/lib/validation/settingsSchema';
import { updateSettings, type SettingKey } from '@/lib/services/settingsService';
import { sanitizeString } from '@/lib/security/sanitize';

type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateSettingsAction(input: unknown): Promise<ActionResult> {
  const session = await verifyAdminSession();
  if (!session) return { ok: false, error: 'unauthorized' };

  const rl = await checkRateLimit(adminWriteRateLimit, `settings:${session.userId}`);
  if (!rl.success) return { ok: false, error: 'rate_limit' };

  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'validation' };

  const entries = (Object.entries(parsed.data) as [SettingKey, string][]).map(
    ([key, value]) => ({ key, value: sanitizeString(value) }),
  );

  try {
    await updateSettings(entries, session.userId);
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch {
    return { ok: false, error: 'generic' };
  }
}
