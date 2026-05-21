import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import Services from '@/components/sections/Services';
import CtaFinal from '@/components/sections/CtaFinal';
import Container from '@/components/ui/Container';
import { getSettings } from '@/lib/services/settingsService';

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: 'Servicios',
  description: 'SaaS a medida, CRMs, webs, chatbots con IA e integraciones. Construimos el software que tu negocio necesita.',
};

export default async function ServiciosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const settings = await getSettings();

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <div className="py-24 md:py-32">
          <Container className="text-center mb-8">
            <h1 className="font-medium text-primary tracking-tight" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
              Nuestros servicios
            </h1>
          </Container>
          <Services />
        </div>
        <CtaFinal calendlyUrl={settings.calendly_url} />
      </main>
      <Footer />
    </>
  );
}
