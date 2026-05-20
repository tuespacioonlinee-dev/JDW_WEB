import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  className?: string;
  glow?: 'purple' | 'teal' | 'coral' | 'pink' | 'none';
};

const glowMap: Record<NonNullable<Props['glow']>, string> = {
  purple: 'hover:shadow-[0_0_30px_rgba(127,119,221,0.15)]',
  teal: 'hover:shadow-[0_0_30px_rgba(93,202,165,0.15)]',
  coral: 'hover:shadow-[0_0_30px_rgba(240,153,123,0.15)]',
  pink: 'hover:shadow-[0_0_30px_rgba(237,147,177,0.15)]',
  none: '',
};

export default function Card({ children, className, glow = 'none' }: Props) {
  return (
    <div
      className={cn(
        'bg-bg-surface border border-[rgba(255,255,255,0.08)] rounded-2xl',
        'transition-all duration-300',
        'hover:border-[rgba(255,255,255,0.18)] hover:bg-bg-elevated',
        glow !== 'none' && glowMap[glow],
        className,
      )}
    >
      {children}
    </div>
  );
}
