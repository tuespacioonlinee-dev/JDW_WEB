import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <HeroPlaceholder />
    </main>
  );
}

function HeroPlaceholder() {
  const t = useTranslations('hero');
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-medium text-primary">
          {t('title_line1')} {t('title_line2')}
        </h1>
        <p className="mt-4 text-muted">{t('subtitle')}</p>
        <p className="mt-8 text-dim text-sm">JDC Developers — Fase 1 i18n OK ✓</p>
      </div>
    </section>
  );
}
