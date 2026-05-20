'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import { fadeInUp, staggerContainerFast, viewportOnce } from '@/components/motion/variants';

const STEPS = [1, 2, 3, 4] as const;

export default function Process() {
  const t = useTranslations('process');

  return (
    <section
      id="proceso"
      className="py-24 md:py-32"
      aria-labelledby="process-heading"
    >
      <Container>
        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.05em] text-dim mb-4">{t('eyebrow')}</p>
            <h2
              id="process-heading"
              className="font-medium text-primary tracking-tight"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
            >
              {t('title')}
            </h2>
          </motion.div>

          {/* Steps */}
          <div className="relative">
            {/* Connector line — desktop only */}
            <div
              className="hidden md:block absolute top-6 left-[calc(12.5%)] right-[calc(12.5%)] h-px bg-border"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
              {STEPS.map((n, i) => (
                <motion.div
                  key={n}
                  variants={fadeInUp}
                  className="relative flex flex-col items-center text-center gap-4 md:gap-3"
                >
                  {/* Number circle */}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-bg-elevated border border-border flex items-center justify-center">
                    <span className="text-sm font-medium text-accent-purple">0{n}</span>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-base font-medium text-primary mb-1">
                      {t(`step_${n}_title`)}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {t(`step_${n}_desc`)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
