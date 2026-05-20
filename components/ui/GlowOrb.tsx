'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Props = {
  color?: 'purple' | 'teal' | 'coral';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

const colorMap = {
  purple: 'bg-accent-purple',
  teal: 'bg-accent-teal',
  coral: 'bg-accent-coral',
};

const sizeMap = {
  sm: 'w-48 h-48',
  md: 'w-72 h-72',
  lg: 'w-[500px] h-[500px]',
  xl: 'w-[700px] h-[700px]',
};

export default function GlowOrb({ color = 'purple', size = 'lg', className }: Props) {
  return (
    <motion.div
      className={cn(
        'absolute rounded-full blur-[120px] opacity-30 pointer-events-none',
        colorMap[color],
        sizeMap[size],
        className,
      )}
      animate={{
        opacity: [0.2, 0.45, 0.2],
        scale: [1, 1.15, 1],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      aria-hidden="true"
    />
  );
}
