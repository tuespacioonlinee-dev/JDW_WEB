import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { getSettings } from '@/lib/services/settingsService';

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: '¡Mensaje recibido!',
  robots: { index: false, follow: false },
};

export default async function GraciasPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'thanks' });
  const settings = await getSettings();
  const calendlyUrl = settings.calendly_url || '#';

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <Container className="py-32 max-w-xl text-center flex flex-col items-center gap-8">
          <div className="w-16 h-16 rounded-full bg-[rgba(93,202,165,0.1)] border border-[rgba(93,202,165,0.2)] flex items-center justify-center">
            <CheckCircle size={32} className="text-accent-teal" aria-hidden="true" />
          </div>

          <div className="flex flex-col gap-3">
            <h1
              className="font-medium text-primary tracking-tight"
              style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}
            >
              {t('title')}
            </h1>
            <p className="text-muted leading-relaxed">{t('subtitle')}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
              <Button size="md">{t('cta_calendly')}</Button>
            </a>
            <Link href="/">
              <Button variant="ghost" size="md" className="gap-2">
                <ArrowLeft size={16} aria-hidden="true" />
                {t('cta_back')}
              </Button>
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
