'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import { fadeInUp, staggerContainerFast, viewportOnce } from '@/components/motion/variants';

const METRICS_KEYS = ['projects', 'delivery', 'response', 'experience'] as const;

export default function Metrics() {
  const t = useTranslations('metrics');

  return (
    <section className="py-16 md:py-24 border-y border-border" aria-label="Métricas">
      <Container>
        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4"
        >
          {METRICS_KEYS.map((key) => (
            <motion.div
              key={key}
              variants={fadeInUp}
              className="flex flex-col items-center text-center gap-1"
            >
              <span
                className="font-medium text-primary leading-none tracking-tight tabular-nums"
                style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
              >
                {t(`${key}_value`)}
              </span>
              <span className="text-sm text-muted">{t(`${key}_label`)}</span>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
