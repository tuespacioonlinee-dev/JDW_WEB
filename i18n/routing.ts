import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/servicios': {
      es: '/servicios',
      en: '/services',
    },
    '/trabajo': {
      es: '/trabajo',
      en: '/work',
    },
    '/nosotros': {
      es: '/nosotros',
      en: '/about',
    },
    '/contacto': {
      es: '/contacto',
      en: '/contact',
    },
    '/gracias': {
      es: '/gracias',
      en: '/thank-you',
    },
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
