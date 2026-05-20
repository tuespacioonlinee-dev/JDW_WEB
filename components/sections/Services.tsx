'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Database, Globe, Bot, Plug, Check } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerContainerFast, viewportOnce } from '@/components/motion/variants';

const SERVICES = [
  {
    key: 'saas' as const,
    icon: Database,
    color: 'teal' as const,
    stack: ['Next.js', 'Supabase', 'Postgres', 'Vercel'],
  },
  {
    key: 'web' as const,
    icon: Globe,
    color: 'purple' as const,
    stack: ['Next.js', 'Tailwind', 'Framer Motion', 'Vercel'],
  },
  {
    key: 'ai' as const,
    icon: Bot,
    color: 'coral' as const,
    stack: ['Claude', 'OpenAI', 'LangChain', 'WhatsApp Business'],
  },
  {
    key: 'integrations' as const,
    icon: Plug,
    color: 'pink' as const,
    stack: ['SAP', 'Mercado Pago', 'Tienda Nube', 'n8n'],
  },
] as const;

const iconColorMap = {
  teal: 'text-accent-teal',
  purple: 'text-accent-purple',
  coral: 'text-accent-coral',
  pink: 'text-accent-pink',
} as const;

export default function Services() {
  const t = useTranslations('services');

  return (
    <section
      id="servicios"
      className="py-24 md:py-32"
      aria-labelledby="services-heading"
    >
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.05em] text-dim mb-4">{t('eyebrow')}</p>
            <h2
              id="services-heading"
              className="font-medium text-primary tracking-tight mb-4"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
            >
              {t('title')}
            </h2>
            <p className="text-muted max-w-xl mx-auto leading-relaxed">{t('subtitle')}</p>
          </motion.div>

          {/* Grid */}
          <motion.div
            variants={staggerContainerFast}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          >
            {SERVICES.map(({ key, icon: Icon, color, stack }) => (
              <motion.div key={key} variants={fadeInUp}>
                <Card glow={color} className="p-6 h-full flex flex-col gap-5">
                  {/* Icon + title */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2.5 rounded-xl bg-bg-elevated border border-border ${iconColorMap[color]}`}
                      aria-hidden="true"
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-primary">{t(`${key}.title`)}</h3>
                      <p className="text-sm text-muted mt-1 leading-relaxed">
                        {t(`${key}.description`)}
                      </p>
                    </div>
                  </div>

                  {/* Stack chips */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-dim">{t('stack_label')}</span>
                    {stack.map((tech) => (
                      <Badge key={tech} variant="default" className="text-[11px] px-2 py-0.5">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Bullets */}
                  <ul className="flex flex-col gap-2" role="list">
                    {[1, 2, 3, 4].map((n) => (
                      <li key={n} className="flex items-start gap-2 text-sm text-muted">
                        <Check
                          size={14}
                          className={`mt-0.5 shrink-0 ${iconColorMap[color]}`}
                          aria-hidden="true"
                        />
                        {t(`${key}.bullet_${n}`)}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
