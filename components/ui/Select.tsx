import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import type { SelectHTMLAttributes } from 'react';

type Option = { value: string; label: string };

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
  label?: string;
  options: Option[];
  placeholder?: string;
};

const Select = forwardRef<HTMLSelectElement, Props>(
  ({ error, label, id, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-muted">
            {label}
            {props.required && <span className="text-accent-coral ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={cn(
              'w-full appearance-none bg-bg-surface border border-border rounded-xl px-4 py-3 pr-10 text-sm',
              'transition-all duration-150',
              'hover:border-border-hover',
              'focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple',
              error && 'border-accent-coral focus:border-accent-coral focus:ring-accent-coral',
              !props.value && placeholder ? 'text-dim' : 'text-primary',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-bg-elevated text-primary">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dim pointer-events-none"
            aria-hidden="true"
          />
        </div>
        {error && (
          <p id={`${id}-error`} role="alert" className="text-xs text-accent-coral">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
export default Select;
