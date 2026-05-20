import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer' | 'nav';
};

export default function Container({ children, className, as: Tag = 'div' }: Props) {
  return (
    <Tag className={cn('max-w-[1200px] mx-auto px-6 md:px-8', className)}>
      {children}
    </Tag>
  );
}
