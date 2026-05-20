export type Locale = 'es' | 'en';

export const locales: Locale[] = ['es', 'en'];
export const defaultLocale: Locale = 'es';

export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

export const localeFlags: Record<Locale, string> = {
  es: '🇦🇷',
  en: '🇺🇸',
};

export const localeCodes: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
};
