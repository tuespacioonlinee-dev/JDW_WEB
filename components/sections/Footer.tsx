import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Container from '@/components/ui/Container';
import { Github, Linkedin, Twitter } from 'lucide-react';

const NAV_LINKS = [
  { href: '/servicios' as const, key: 'services' },
  { href: '/trabajo' as const, key: 'work' },
  { href: '/nosotros' as const, key: 'about' },
  { href: '/contacto' as const, key: 'contact' },
] as const;

const SOCIAL_LINKS = [
  { href: 'https://github.com/jdcdevelopers', label: 'GitHub', icon: Github },
  { href: 'https://linkedin.com/company/jdcdevelopers', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://twitter.com/jdcdevelopers', label: 'Twitter / X', icon: Twitter },
] as const;

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear().toString();

  return (
    <footer className="border-t border-border py-16 md:py-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-lg font-semibold text-primary tracking-tight">
              JDC<span className="text-accent-purple">.</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Software factory especializada en soluciones a medida para LATAM.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs uppercase tracking-[0.05em] text-dim mb-4">
              {t('nav_title')}
            </p>
            <ul className="flex flex-col gap-2" role="list">
              {NAV_LINKS.map(({ href, key }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Social */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.05em] text-dim mb-4">
                {t('contact_title')}
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href={`mailto:${t('email')}`}
                  className="text-sm text-muted hover:text-primary transition-colors"
                >
                  {t('email')}
                </a>
                <span className="text-sm text-dim">{t('location')}</span>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.05em] text-dim mb-4">
                {t('social_title')}
              </p>
              <div className="flex items-center gap-4">
                {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-dim hover:text-primary transition-colors"
                  >
                    <Icon size={18} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-dim">
          <span>{t('copyright', { year })}</span>
          <span>{t('made_with')}</span>
        </div>
      </Container>
    </footer>
  );
}
