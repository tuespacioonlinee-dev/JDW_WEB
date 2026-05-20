'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales, localeCodes, localeNames } from '@/types/locale';
import { Globe } from 'lucide-react';
import { useState } from 'react';
import type { Locale } from '@/types/locale';

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function switchLocale(next: Locale) {
    setOpen(false);
    router.replace(pathname, { locale: next });
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Cambiar idioma"
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-muted hover:text-primary border border-transparent hover:border-border transition-all duration-150"
      >
        <Globe size={14} aria-hidden="true" />
        <span className="font-medium tracking-wide">{localeCodes[locale]}</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <ul
            role="listbox"
            aria-label="Seleccionar idioma"
            className="absolute right-0 top-full mt-1.5 z-50 bg-bg-elevated border border-border rounded-lg shadow-xl overflow-hidden min-w-[120px]"
          >
            {locales.map((loc) => (
              <li
                key={loc}
                role="option"
                aria-selected={loc === locale}
              >
                <button
                  onClick={() => switchLocale(loc)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors text-left ${
                    loc === locale
                      ? 'text-primary bg-bg-surface'
                      : 'text-muted hover:text-primary hover:bg-bg-surface'
                  }`}
                >
                  <span className="font-medium w-6">{localeCodes[loc]}</span>
                  <span className="text-dim">{localeNames[loc]}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
