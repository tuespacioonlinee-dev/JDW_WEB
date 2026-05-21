'use server';

import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '@/lib/services/authService';
import { adminWriteRateLimit, checkRateLimit } from '@/lib/security/rateLimit';
import { caseStudySchema, updateCaseStudySchema } from '@/lib/validation/caseSchema';
import { createCase, updateCase, deleteCase, uploadCaseImage } from '@/lib/services/caseService';
import { sanitizeString } from '@/lib/security/sanitize';
import type { CaseStudyInput } from '@/types/case';

type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

function sanitizeInput(input: CaseStudyInput): CaseStudyInput {
  return {
    ...input,
    name: sanitizeString(input.name),
    category_es: sanitizeString(input.category_es),
    category_en: sanitizeString(input.category_en),
    description_es: sanitizeString(input.description_es),
    description_en: sanitizeString(input.description_en),
    metrics: input.metrics.map((m) => ({
      label_es: sanitizeString(m.label_es),
      label_en: sanitizeString(m.label_en),
    })),
  };
}

async function guard(): Promise<{ userId: string } | { error: string }> {
  const session = await verifyAdminSession();
  if (!session) return { error: 'unauthorized' };

  const rl = await checkRateLimit(adminWriteRateLimit, `case:${session.userId}`);
  if (!rl.success) return { error: 'rate_limit' };

  return { userId: session.userId };
}

function revalidate() {
  // Home (FeaturedCase) and /trabajo both live under the locale layout
  revalidatePath('/', 'layout');
}

export async function createCaseAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const g = await guard();
  if ('error' in g) return { ok: false, error: g.error };

  const parsed = caseStudySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'validation' };

  try {
    const result = await createCase(sanitizeInput(parsed.data));
    revalidate();
    return { ok: true, data: result };
  } catch {
    return { ok: false, error: 'generic' };
  }
}

export async function updateCaseAction(input: unknown): Promise<ActionResult> {
  const g = await guard();
  if ('error' in g) return { ok: false, error: g.error };

  const parsed = updateCaseStudySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'validation' };

  const { id, ...rest } = parsed.data;
  try {
    await updateCase(id, sanitizeInput(rest));
    revalidate();
    return { ok: true };
  } catch {
    return { ok: false, error: 'generic' };
  }
}

export async function deleteCaseAction(id: unknown): Promise<ActionResult> {
  const g = await guard();
  if ('error' in g) return { ok: false, error: g.error };
  if (typeof id !== 'string' || id.length === 0) return { ok: false, error: 'validation' };

  try {
    await deleteCase(id);
    revalidate();
    return { ok: true };
  } catch {
    return { ok: false, error: 'generic' };
  }
}

export async function uploadCaseImageAction(
  formData: FormData,
): Promise<ActionResult<{ url: string }>> {
  const g = await guard();
  if ('error' in g) return { ok: false, error: g.error };

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'validation' };
  if (file.size > MAX_IMAGE_BYTES) return { ok: false, error: 'too_large' };
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return { ok: false, error: 'bad_type' };

  try {
    const url = await uploadCaseImage(file);
    return { ok: true, data: { url } };
  } catch {
    return { ok: false, error: 'generic' };
  }
}
