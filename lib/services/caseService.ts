import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { CaseStudy, CaseStudyInput } from '@/types/case';

const BUCKET = 'case-images';

const SELECT_COLUMNS =
  'id, name, category_es, category_en, description_es, description_en, metrics, image_url, color, display_order, published, created_at, updated_at';

// PUBLIC — only published cases, respects RLS via anon client
export async function getPublishedCases(): Promise<CaseStudy[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('case_studies')
    .select(SELECT_COLUMNS)
    .eq('published', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[caseService] getPublishedCases failed:', error.code);
    return [];
  }

  return (data ?? []) as CaseStudy[];
}

// ADMIN — all cases including drafts
export async function getAllCases(): Promise<CaseStudy[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('case_studies')
    .select(SELECT_COLUMNS)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[caseService] getAllCases failed:', error.code);
    throw new Error('Failed to fetch cases');
  }

  return (data ?? []) as CaseStudy[];
}

export async function createCase(input: CaseStudyInput): Promise<{ id: string }> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('case_studies')
    .insert(input)
    .select('id')
    .single();

  if (error) {
    console.error('[caseService] createCase failed:', error.code);
    throw new Error('Failed to create case');
  }

  return { id: data.id as string };
}

export async function updateCase(id: string, input: CaseStudyInput): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('case_studies')
    .update(input)
    .eq('id', id);

  if (error) {
    console.error('[caseService] updateCase failed:', error.code);
    throw new Error('Failed to update case');
  }
}

export async function deleteCase(id: string): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase.from('case_studies').delete().eq('id', id);

  if (error) {
    console.error('[caseService] deleteCase failed:', error.code);
    throw new Error('Failed to delete case');
  }
}

export async function uploadCaseImage(file: File): Promise<string> {
  const supabase = createAdminClient();

  const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
  const path = `${crypto.randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error('[caseService] uploadCaseImage failed:', error.message);
    throw new Error('Failed to upload image');
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
