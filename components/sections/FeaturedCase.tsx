'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import Badge from '@/components/ui/Badge';
import { slideInLeft, slideInRight, staggerContainer, viewportOnce } from '@/components/motion/variants';
import { ArrowRight } from 'lucide-react';

const CASE_METRICS = ['metric_1', 'metric_2', 'metric_3'] as const;

type Props = {
  imageUrl?: string | null;
};

export default function FeaturedCase({ imageUrl }: Props) {
  const t = useTranslations('featured_case');

  return (
    <section
      className="py-24 md:py-32 bg-bg-surface"
      aria-labelledby="case-heading"
    >
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Image / mockup — left */}
          <motion.div variants={slideInLeft}>
            <div className="relative aspect-video bg-bg-elevated border border-border rounded-2xl flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={t('title')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-dim">
                  {/* Simplified UI mockup */}
                  <div className="w-full px-8">
                    <div className="h-8 bg-bg-surface rounded-lg mb-3" />
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-bg-surface rounded-lg" />
                      ))}
                    </div>
                    <div className="h-24 bg-bg-surface rounded-lg" />
                  </div>
                  <span className="text-xs">Ofikio CRM</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Content — right */}
          <motion.div variants={slideInRight} className="flex flex-col gap-6">
            <div>
              <Badge variant="teal">{t('eyebrow')}</Badge>
            </div>

            <div>
              <h2
                id="case-heading"
                className="font-medium text-primary tracking-tight leading-tight mb-4"
                style={{ fontSize: 'clamp(24px, 3.5vw, 40px)' }}
              >
                {t('title')}
              </h2>
              <p className="text-muted leading-relaxed">{t('description')}</p>
            </div>

            {/* Mini metrics */}
            <div className="grid grid-cols-3 gap-4">
              {CASE_METRICS.map((key) => (
                <div key={key} className="flex flex-col gap-1">
                  <span className="text-2xl font-medium text-primary tabular-nums">
                    {t(`${key}_value`)}
                  </span>
                  <span className="text-xs text-dim leading-snug">{t(`${key}_label`)}</span>
                </div>
              ))}
            </div>

            {/* Link */}
            <Link
              href="/trabajo"
              className="inline-flex items-center gap-2 text-sm text-accent-teal hover:text-primary transition-colors group"
            >
              {t('link')}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
