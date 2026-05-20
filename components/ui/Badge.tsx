import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'purple' | 'teal' | 'coral' | 'pink';

type Props = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  dot?: boolean;
};

const variantClasses: Record<Variant, string> = {
  default: 'bg-bg-elevated border-border text-muted',
  purple: 'bg-[rgba(127,119,221,0.1)] border-[rgba(127,119,221,0.2)] text-accent-purple',
  teal: 'bg-[rgba(93,202,165,0.1)] border-[rgba(93,202,165,0.2)] text-accent-teal',
  coral: 'bg-[rgba(240,153,123,0.1)] border-[rgba(240,153,123,0.2)] text-accent-coral',
  pink: 'bg-[rgba(237,147,177,0.1)] border-[rgba(237,147,177,0.2)] text-accent-pink',
};

const dotColors: Record<Variant, string> = {
  default: 'bg-muted',
  purple: 'bg-accent-purple',
  teal: 'bg-accent-teal',
  coral: 'bg-accent-coral',
  pink: 'bg-accent-pink',
};

export default function Badge({ children, variant = 'default', className, dot }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium border rounded-full',
        variantClasses[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full animate-pulse-dot', dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
