import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ error, label, id, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-muted">
            {label}
            {props.required && <span className="text-accent-coral ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            'w-full bg-bg-surface border border-border rounded-xl px-4 py-3 text-sm text-primary',
            'placeholder:text-dim',
            'transition-all duration-150',
            'hover:border-border-hover',
            'focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple',
            error && 'border-accent-coral focus:border-accent-coral focus:ring-accent-coral',
            className,
          )}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} role="alert" className="text-xs text-accent-coral">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
