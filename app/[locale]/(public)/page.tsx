import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Metrics from '@/components/sections/Metrics';
import Process from '@/components/sections/Process';
import FeaturedCase from '@/components/sections/FeaturedCase';
import Stack from '@/components/sections/Stack';
import Why from '@/components/sections/Why';
import CtaFinal from '@/components/sections/CtaFinal';
import Footer from '@/components/sections/Footer';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });

  return {
    title: `JDC Developers — ${t('title_line1')} ${t('title_line2')}`,
    description: t('subtitle'),
    alternates: {
      canonical: locale === 'es' ? '/' : '/en',
      languages: {
        'es': '/',
        'en': '/en',
      },
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero locale={locale} />
        <Services />
        <Metrics />
        <Process />
        <FeaturedCase />
        <Stack />
        <Why />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
