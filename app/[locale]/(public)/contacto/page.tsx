import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import ContactForm from '@/components/sections/ContactForm';
import Container from '@/components/ui/Container';
import { Toaster } from 'sonner';
import { getSettings } from '@/lib/services/settingsService';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact_form' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'contact_form' });
  const settings = await getSettings();

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <Container className="py-24 md:py-32 max-w-2xl">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.05em] text-dim mb-4">
              {locale === 'es' ? 'Contacto' : 'Contact'}
            </p>
            <h1
              className="font-medium text-primary tracking-tight mb-4"
              style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}
            >
              {t('title')}
            </h1>
            <p className="text-muted">{t('subtitle')}</p>
          </div>
          <ContactForm whatsappNumber={settings.contact_whatsapp} />
        </Container>
      </main>
      <Footer />
      <Toaster richColors theme="dark" position="top-right" />
    </>
  );
}
