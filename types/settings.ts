export const SETTING_KEYS = [
  'contact_email',
  'contact_whatsapp',
  'contact_location',
  'social_github',
  'social_linkedin',
  'social_x',
] as const;

export type SettingKey = (typeof SETTING_KEYS)[number];
export type SettingsMap = Partial<Record<SettingKey, string>>;
