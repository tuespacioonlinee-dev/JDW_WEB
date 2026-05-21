'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import GlowOrb from '@/components/ui/GlowOrb';
import { fadeInUp, staggerContainer, viewportOnce } from '@/components/motion/variants';
import { ArrowRight } from 'lucide-react';

type Props = {
  calendlyUrl?: string;
};

export default function CtaFinal({ calendlyUrl: calendlyUrlProp }: Props) {
  const t = useTranslations('cta_final');
  const calendlyUrl = calendlyUrlProp || process.env.NEXT_PUBLIC_CALENDLY_URL || '#';

  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-bg-base via-[rgba(127,119,221,0.05)] to-bg-base"
        aria-hidden="true"
      />
      <GlowOrb
        color="purple"
        size="lg"
        className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
      />

      <Container className="relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center flex flex-col items-center gap-8"
        >
          <motion.h2
            id="cta-heading"
            variants={fadeInUp}
            className="font-medium text-primary tracking-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 56px)' }}
          >
            {t('title')}
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-lg text-muted max-w-xl">
            {t('subtitle')}
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col items-center gap-4">
            <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2">
                {t('cta')}
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
            </a>

            <p className="text-sm text-dim">
              {t('email_prefix')}{' '}
              <a
                href={`mailto:${t('email')}`}
                className="text-muted hover:text-primary transition-colors underline underline-offset-2"
              >
                {t('email')}
              </a>
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
