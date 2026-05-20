import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import CtaFinal from '@/components/sections/CtaFinal';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: 'Trabajo',
  description: 'Casos de éxito de JDC Developers: proyectos reales entregados en producción.',
};

const CASES = [
  {
    name: 'Ofikio',
    category: 'CRM a medida',
    description: 'Sistema de gestión para empresa de alquiler de mobiliario de oficina. Reemplazó WhatsApp y planillas de Excel.',
    metrics: ['212 materiales', '+30 features', 'MVP en 4 meses'],
    color: 'teal' as const,
  },
];

export default async function TrabajoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <Container className="py-24 md:py-32">
          <div className="mb-16">
            <p className="text-xs uppercase tracking-[0.05em] text-dim mb-4">Portafolio</p>
            <h1
              className="font-medium text-primary tracking-tight"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
            >
              Proyectos en producción
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CASES.map((c) => (
              <Card key={c.name} glow={c.color} className="p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-medium text-primary">{c.name}</h2>
                  <Badge variant={c.color}>{c.category}</Badge>
                </div>
                <p className="text-sm text-muted leading-relaxed">{c.description}</p>
                <div className="flex flex-wrap gap-2">
                  {c.metrics.map((m) => (
                    <span key={m} className="text-xs text-dim bg-bg-elevated border border-border px-3 py-1 rounded-full">
                      {m}
                    </span>
                  ))}
                </div>
              </Card>
            ))}

            {/* Coming soon placeholder */}
            <Card className="p-6 flex flex-col items-center justify-center gap-3 min-h-[200px] border-dashed">
              <p className="text-sm text-dim">Próximamente</p>
              <p className="text-xs text-dim opacity-60">Más casos en camino</p>
            </Card>
          </div>
        </Container>
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
