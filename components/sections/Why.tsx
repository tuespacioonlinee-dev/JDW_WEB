'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import { Cpu, MapPin, Rocket } from 'lucide-react';
import { fadeInUp, staggerContainerFast, viewportOnce } from '@/components/motion/variants';

const COLUMNS = [
  { key: 'col_1', icon: Cpu, color: 'purple' as const },
  { key: 'col_2', icon: MapPin, color: 'teal' as const },
  { key: 'col_3', icon: Rocket, color: 'coral' as const },
] as const;

const iconColorMap = {
  purple: 'text-accent-purple',
  teal: 'text-accent-teal',
  coral: 'text-accent-coral',
} as const;

export default function Why() {
  const t = useTranslations('why');

  return (
    <section className="py-24 md:py-32 bg-bg-surface" aria-labelledby="why-heading">
      <Container>
        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.05em] text-dim mb-4">{t('eyebrow')}</p>
            <h2
              id="why-heading"
              className="font-medium text-primary tracking-tight"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
            >
              {t('title')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {COLUMNS.map(({ key, icon: Icon, color }) => (
              <motion.div key={key} variants={fadeInUp}>
                <Card glow={color} className="p-6 flex flex-col gap-4 h-full">
                  <div className={`p-3 rounded-xl bg-bg-base border border-border w-fit ${iconColorMap[color]}`}>
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-primary mb-2">
                      {t(`${key}_title`)}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {t(`${key}_desc`)}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
