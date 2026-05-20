'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/servicios' as const, labelKey: 'services' },
  { href: '/trabajo' as const, labelKey: 'work' },
  { href: '/nosotros' as const, labelKey: 'about' },
  { href: '/contacto' as const, labelKey: 'contact' },
] as const;

export default function Navbar() {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-bg-base/80 backdrop-blur-xl border-b border-border'
          : 'bg-transparent',
      )}
    >
      <Container>
        <nav
          className="flex items-center justify-between h-16"
          aria-label="Navegación principal"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-lg font-semibold text-primary tracking-tight">
              JDC<span className="text-accent-purple">.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-6" role="list">
            {NAV_LINKS.map(({ href, labelKey }) => (
              <li key={labelKey}>
                <Link
                  href={href}
                  className="text-sm text-muted hover:text-primary transition-colors duration-150"
                >
                  {t(labelKey)}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/contacto">
              <Button size="sm">{t('cta')}</Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? t('menu_close') : t('menu_open')}
              aria-expanded={open}
              className="p-2 text-muted hover:text-primary transition-colors"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-bg-surface/95 backdrop-blur-xl border-b border-border"
          >
            <Container>
              <ul className="flex flex-col py-4 gap-1" role="list">
                {NAV_LINKS.map(({ href, labelKey }) => (
                  <li key={labelKey}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className="block px-2 py-3 text-sm text-muted hover:text-primary transition-colors"
                    >
                      {t(labelKey)}
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <Link href="/contacto" onClick={() => setOpen(false)}>
                    <Button size="sm" className="w-full">{t('cta')}</Button>
                  </Link>
                </li>
              </ul>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
