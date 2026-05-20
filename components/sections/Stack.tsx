'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import { fadeInUp, viewportOnce } from '@/components/motion/variants';
import { useReducedMotion } from 'framer-motion';

const STACK_ROW_1 = [
  'Next.js', 'Supabase', 'Vercel', 'Mercado Pago', 'Claude', 'OpenAI',
  'WhatsApp Business', 'Tailwind CSS',
];

const STACK_ROW_2 = [
  'TypeScript', 'PostgreSQL', 'Stripe', 'Tienda Nube', 'AFIP', 'n8n',
  'Framer Motion', 'React',
];

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const shouldReduceMotion = useReducedMotion();

  // Double the items for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden py-2" aria-hidden="true">
      <motion.div
        className="flex gap-4 w-max"
        animate={
          shouldReduceMotion
            ? {}
            : { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }
        }
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {doubled.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="flex items-center gap-2 px-4 py-2 bg-bg-elevated border border-border rounded-lg text-sm text-muted whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-purple opacity-60" aria-hidden="true" />
            {tech}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Stack() {
  const t = useTranslations('stack_section');

  return (
    <section className="py-24 md:py-32 overflow-hidden" aria-labelledby="stack-heading">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-[0.05em] text-dim mb-4">{t('eyebrow')}</p>
          <h2
            id="stack-heading"
            className="font-medium text-primary tracking-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
          >
            {t('title')}
          </h2>
        </motion.div>
      </Container>

      {/* Marquee — full width, outside Container */}
      <div className="flex flex-col gap-4">
        <MarqueeRow items={STACK_ROW_1} />
        <MarqueeRow items={STACK_ROW_2} reverse />
      </div>
    </section>
  );
}
