import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import CtaFinal from '@/components/sections/CtaFinal';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getPublishedCases } from '@/lib/services/caseService';
import type { Locale } from '@/types/locale';

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: 'Trabajo',
  description: 'Casos de éxito de JDC Developers: proyectos reales entregados en producción.',
};

export default async function TrabajoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const loc = (locale === 'en' ? 'en' : 'es') as Locale;
  const cases = await getPublishedCases();

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
            {cases.map((c) => {
              const category = loc === 'en' ? c.category_en || c.category_es : c.category_es;
              const description = loc === 'en' ? c.description_en || c.description_es : c.description_es;

              return (
                <Card key={c.id} glow={c.color} className="overflow-hidden flex flex-col">
                  {c.image_url && (
                    <div className="relative aspect-video bg-bg-elevated">
                      <Image
                        src={c.image_url}
                        alt={c.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-xl font-medium text-primary">{c.name}</h2>
                      {category && <Badge variant={c.color}>{category}</Badge>}
                    </div>
                    {description && (
                      <p className="text-sm text-muted leading-relaxed">{description}</p>
                    )}
                    {c.metrics.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {c.metrics.map((m, i) => {
                          const label = loc === 'en' ? m.label_en || m.label_es : m.label_es;
                          if (!label) return null;
                          return (
                            <span
                              key={i}
                              className="text-xs text-dim bg-bg-elevated border border-border px-3 py-1 rounded-full"
                            >
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}

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
