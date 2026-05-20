'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import GlowOrb from '@/components/ui/GlowOrb';
import { fadeInUp, staggerContainer, viewportOnce } from '@/components/motion/variants';
import { ArrowRight } from 'lucide-react';

const CLIENTS = ['Ofikio', 'Tensolite'];

const TYPEWRITER_WORDS_ES = ['necesitaba ayer.', 'soñabas construir.', 'te diferencia.'];
const TYPEWRITER_WORDS_EN = ['needed yesterday.', 'always dreamed of.', 'sets you apart.'];

function Typewriter({ words }: { words: string[] }) {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayed(words[0] ?? '');
      return;
    }

    const word = words[index % words.length] ?? '';
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => i + 1);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, index, words, shouldReduceMotion]);

  return (
    <span className="text-dim">
      {displayed}
      <span className="inline-block w-0.5 h-[0.9em] bg-accent-purple ml-0.5 animate-pulse" aria-hidden="true" />
    </span>
  );
}

export default function Hero({ locale }: { locale: string }) {
  const t = useTranslations('hero');
  const words = locale === 'en' ? TYPEWRITER_WORDS_EN : TYPEWRITER_WORDS_ES;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center py-32 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background glow */}
      <GlowOrb
        color="purple"
        size="xl"
        className="-translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
      />

      <Container className="relative z-10 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col items-center gap-8"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp}>
            <Badge variant="teal" dot>
              {t('badge')}
            </Badge>
          </motion.div>

          {/* H1 */}
          <motion.h1
            id="hero-heading"
            variants={fadeInUp}
            className="font-medium text-primary leading-[1.05] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
          >
            {t('title_line1')}
            <br />
            <Typewriter words={words} />
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="max-w-2xl text-lg text-muted leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/contacto">
              <Button size="lg" className="gap-2">
                {t('cta_primary')}
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/trabajo">
              <Button variant="secondary" size="lg">
                {t('cta_secondary')}
              </Button>
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.p variants={fadeInUp} className="text-sm text-dim">
            {t('trust')}{' '}
            {CLIENTS.map((c, i) => (
              <span key={c}>
                <span className="text-muted">{c}</span>
                {i < CLIENTS.length - 1 && <span className="mx-2 opacity-40">·</span>}
              </span>
            ))}
            <span className="mx-2 opacity-40">·</span>
            <span className="text-muted">+ próximos</span>
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
