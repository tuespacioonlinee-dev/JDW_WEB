import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { SiteContent, ContentMap } from '@/types/content';

/**
 * Apply editable content from `site_content` on top of the static i18n
 * messages. Row {section, field, value} overrides messages[section][field].
 * Returns a deep-cloned object so the static import stays untouched between
 * renders.
 */
export async function applyContentOverrides(
  staticMessages: Record<string, unknown>,
  locale: 'es' | 'en',
): Promise<Record<string, unknown>> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('site_content')
    .select('section, field, value')
    .eq('locale', locale);

  if (error || !data) {
    console.error('[contentService] applyContentOverrides failed:', error?.code);
    return staticMessages;
  }

  const merged = structuredClone(staticMessages) as Record<string, Record<string, string>>;

  for (const row of data as Array<{ section: string; field: string; value: string }>) {
    if (!merged[row.section] || typeof merged[row.section] !== 'object') {
      merged[row.section] = {};
    }
    merged[row.section][row.field] = row.value;
  }

  return merged;
}

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
