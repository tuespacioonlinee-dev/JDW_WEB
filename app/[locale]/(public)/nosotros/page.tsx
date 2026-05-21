import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import CtaFinal from '@/components/sections/CtaFinal';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import { getSettings } from '@/lib/services/settingsService';

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'JDC Developers — software factory fundada por Tomi, Carlos y Juan B. en Tucumán, Argentina.',
};

const TEAM = [
  {
    name: 'Tomi',
    role: 'Co-Founder & Full Stack Engineer',
    description: 'Especializado en arquitectura de sistemas y desarrollo full stack con Next.js y Supabase.',
  },
  {
    name: 'Carlos',
    role: 'Co-Founder & Backend Engineer',
    description: 'Experto en integraciones, APIs y automatizaciones. Domina n8n, AFIP y Mercado Pago.',
  },
  {
    name: 'Juan B.',
    role: 'Co-Founder & AI Engineer',
    description: 'Lidera el desarrollo de agentes IA, RAG y chatbots multi-canal con Claude y OpenAI.',
  },
];

export default async function NosotrosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const settings = await getSettings();

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <Container className="py-24 md:py-32">
          {/* Hero */}
          <div className="max-w-3xl mb-20">
            <p className="text-xs uppercase tracking-[0.05em] text-dim mb-4">Nosotros</p>
            <h1
              className="font-medium text-primary tracking-tight mb-6"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
            >
              Tres ingenieros apasionados por construir software que importa.
            </h1>
            <p className="text-lg text-muted leading-relaxed">
              JDC Developers nació en Tucumán, Argentina con una misión clara: democratizar el acceso
              a tecnología de primer nivel para empresas de LATAM. Construimos software a medida con
              IA en el corazón, desde MVPs hasta plataformas en producción con miles de usuarios.
            </p>
          </div>

          {/* Team */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {TEAM.map((member) => (
              <Card key={member.name} glow="purple" className="p-6 flex flex-col gap-3">
                <div>
                  <h2 className="text-lg font-medium text-primary">{member.name}</h2>
                  <p className="text-sm text-accent-purple mt-0.5">{member.role}</p>
                </div>
                <p className="text-sm text-muted leading-relaxed">{member.description}</p>
              </Card>
            ))}
          </div>

          {/* Values */}
          <div className="mt-20 pt-16 border-t border-border">
            <h2
              className="font-medium text-primary tracking-tight mb-8"
              style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
            >
              Lo que nos define
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              {[
                ['Código limpio o no hay trato', 'No hacemos chapuzas. Cada línea de código se escribe para durar.'],
                ['Honestidad radical', 'Si algo no es viable, te lo decimos antes de empezar, no después de cobrar.'],
                ['IA con criterio', 'Usamos IA donde agrega valor real, no como buzzword de presentación.'],
                ['Tucumán → LATAM', 'Nacimos acá y queremos que más empresas de la región accedan a tech de calidad.'],
              ].map(([title, desc]) => (
                <div key={title} className="flex flex-col gap-2">
                  <h3 className="text-sm font-medium text-primary">{title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
        <CtaFinal calendlyUrl={settings.calendly_url} />
      </main>
      <Footer />
    </>
  );
}
