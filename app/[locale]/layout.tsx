import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { routing } from '@/i18n/routing';
import { applyContentOverrides } from '@/lib/services/contentService';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jdcdevelopers.com'),
  title: {
    default: 'JDC Developers — Software Factory en Tucumán',
    template: '%s | JDC Developers',
  },
  description:
    'Diseñamos y desarrollamos CRMs, webs, chatbots e integraciones a medida. De la idea al deploy, con IA en el corazón. Software factory con base en Tucumán, Argentina.',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    alternateLocale: 'en_US',
    siteName: 'JDC Developers',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'es' | 'en')) {
    notFound();
  }

  const staticMessages = await getMessages();
  const messages = await applyContentOverrides(
    staticMessages as Record<string, unknown>,
    locale as 'es' | 'en',
  );
  const nonce = (await headers()).get('x-nonce') ?? '';

  return (
    <html lang={locale} nonce={nonce} className={`${inter.variable} scroll-smooth`}>
      <body className="bg-bg-base text-primary antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
