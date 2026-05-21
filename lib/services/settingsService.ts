import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { SETTING_KEYS, type SettingKey, type SettingsMap } from '@/types/settings';

export { SETTING_KEYS };
export type { SettingKey, SettingsMap };

// Env fallbacks applied when a setting is missing or empty (e.g. fresh DB)
const ENV_FALLBACKS: SettingsMap = {
  calendly_url: process.env.NEXT_PUBLIC_CALENDLY_URL ?? '',
};

function withFallbacks(map: SettingsMap): SettingsMap {
  const result = { ...map };
  for (const key of SETTING_KEYS) {
    if (!result[key] && ENV_FALLBACKS[key]) {
      result[key] = ENV_FALLBACKS[key];
    }
  }
  return result;
}

// PUBLIC — request-deduplicated read for the public site
export const getSettings = cache(async (): Promise<SettingsMap> => {
  const supabase = await createClient();

  const { data, error } = await supabase.from('site_settings').select('key, value');

  if (error) {
    console.error('[settingsService] getSettings failed:', error.code);
    return withFallbacks({});
  }

  const map: SettingsMap = {};
  for (const row of data ?? []) {
    const typed = row as { key: string; value: string };
    map[typed.key as SettingKey] = typed.value;
  }

  return withFallbacks(map);
});

// ADMIN — full read for the config form (no fallbacks, shows raw stored values)
export async function getAllSettings(): Promise<SettingsMap> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.from('site_settings').select('key, value');

  if (error) {
    console.error('[settingsService] getAllSettings failed:', error.code);
    throw new Error('Failed to fetch settings');
  }

  const map: SettingsMap = {};
  for (const row of data ?? []) {
    const typed = row as { key: string; value: string };
    map[typed.key as SettingKey] = typed.value;
  }

  return map;
}

export async function updateSettings(
  entries: { key: SettingKey; value: string }[],
  updatedBy: string,
): Promise<void> {
  const supabase = createAdminClient();

  const rows = entries.map((e) => ({
    key: e.key,
    value: e.value,
    updated_by: updatedBy,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });

  if (error) {
    console.error('[settingsService] updateSettings failed:', error.code);
    throw new Error('Failed to update settings');
  }
}
