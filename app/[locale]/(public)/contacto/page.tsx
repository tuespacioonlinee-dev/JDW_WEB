import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import Container from '@/components/ui/Container';

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contanos tu proyecto. Te respondemos en menos de 24hs.',
};

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <Container className="py-24 md:py-32 max-w-2xl">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.05em] text-dim mb-4">Contacto</p>
            <h1
              className="font-medium text-primary tracking-tight mb-4"
              style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}
            >
              Contanos tu proyecto
            </h1>
            <p className="text-muted">
              Te respondemos en menos de 24hs. Sin compromiso.
            </p>
          </div>
          {/* ContactForm will be added in Phase 6 */}
          <p className="text-sm text-dim">Formulario disponible próximamente.</p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
