import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { SiteContent, ContentMap } from '@/types/content';

export async function getContent(locale: 'es' | 'en'): Promise<ContentMap> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('site_content')
    .select('id, value')
    .eq('locale', locale);

  if (error) {
    console.error('[contentService] getContent failed:', error.code);
    return {};
  }

  const map: ContentMap = {};
  for (const row of data ?? []) {
    const typed = row as { id: string; value: string };
    map[typed.id] = typed.value;
  }

  return map;
}

export async function getContentBySection(
  section: string,
  locale: 'es' | 'en',
): Promise<ContentMap> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('site_content')
    .select('field, value')
    .eq('section', section)
    .eq('locale', locale);

  if (error) {
    console.error('[contentService] getContentBySection failed:', error.code);
    return {};
  }

  const map: ContentMap = {};
  for (const row of data ?? []) {
    const typed = row as { field: string; value: string };
    map[typed.field] = typed.value;
  }

  return map;
}

export async function getAllContent(): Promise<SiteContent[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .order('section')
    .order('field');

  if (error) {
    console.error('[contentService] getAllContent failed:', error.code);
    throw new Error('Failed to fetch content');
  }

  return (data ?? []) as SiteContent[];
}

export async function updateContent(
  id: string,
  locale: 'es' | 'en',
  value: string,
  updatedBy: string,
): Promise<void> {
  const supabase = createAdminClient();

  // Content rows are seeded; we only edit existing ones. Use UPDATE (not upsert)
  // so we don't trip the NOT NULL constraints on section/field that an INSERT needs.
  const { error } = await supabase
    .from('site_content')
    .update({
      value,
      updated_by: updatedBy,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('locale', locale);

  if (error) {
    console.error('[contentService] updateContent failed:', error.code);
    throw new Error('Failed to update content');
  }
}
