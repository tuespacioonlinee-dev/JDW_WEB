'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { leadSchema, type LeadFormInput } from '@/lib/validation/leadSchema';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

const PROJECT_TYPE_KEYS = [
  { value: 'saas', labelKey: 'project_saas' },
  { value: 'web', labelKey: 'project_web' },
  { value: 'chatbot', labelKey: 'project_chatbot' },
  { value: 'integration', labelKey: 'project_integration' },
  { value: 'other', labelKey: 'project_other' },
] as const;

const BUDGET_KEYS = [
  { value: '<1M', labelKey: 'budget_lt1m' },
  { value: '1-5M', labelKey: 'budget_1to5m' },
  { value: '5-15M', labelKey: 'budget_5to15m' },
  { value: '15M+', labelKey: 'budget_gt15m' },
  { value: 'undecided', labelKey: 'budget_undecided' },
] as const;

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      getResponse: (widgetId: string) => string | undefined;
    };
  }
}

export default function ContactForm() {
  const t = useTranslations('contact_form');
  const locale = useLocale();
  const router = useRouter();
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      locale: locale as 'es' | 'en',
      honeypot: '',
    },
  });

  // Load Turnstile script
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey || !turnstileRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.turnstile && turnstileRef.current) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: siteKey,
          callback: (token: string) => setValue('turnstile_token', token),
          'error-callback': () => setValue('turnstile_token', ''),
          theme: 'dark',
        });
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [setValue]);

  const projectTypeOptions = PROJECT_TYPE_KEYS.map(({ value, labelKey }) => ({
    value,
    label: t(labelKey),
  }));

  const budgetOptions = BUDGET_KEYS.map(({ value, labelKey }) => ({
    value,
    label: t(labelKey),
  }));

  async function onSubmit(data: LeadFormInput) {
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok && res.status === 429) {
        toast.error(locale === 'es'
          ? 'Demasiados intentos. Intentá en una hora.'
          : 'Too many attempts. Try again in an hour.'
        );
        return;
      }

      const json = (await res.json()) as { ok: boolean; error?: string };

      if (!json.ok) {
        toast.error(t('error_generic'));
        // Reset Turnstile on failure
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
          setValue('turnstile_token', '');
        }
        return;
      }

      router.push('/gracias');
    } catch {
      toast.error(t('error_generic'));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {/* Honeypot — hidden from real users, visible to bots */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ display: 'none' }}
        {...register('honeypot')}
      />

      {/* Hidden locale */}
      <input type="hidden" {...register('locale')} />

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="name"
          label={t('name_label')}
          placeholder={t('name_placeholder')}
          required
          error={errors.name?.message ? t(errors.name.message as Parameters<typeof t>[0]) : undefined}
          {...register('name')}
        />
        <Input
          id="email"
          type="email"
          label={t('email_label')}
          placeholder={t('email_placeholder')}
          required
          error={errors.email?.message ? t(errors.email.message as Parameters<typeof t>[0]) : undefined}
          {...register('email')}
        />
      </div>

      {/* Phone + Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="phone"
          type="tel"
          label={t('phone_label')}
          placeholder={t('phone_placeholder')}
          error={errors.phone?.message ? t(errors.phone.message as Parameters<typeof t>[0]) : undefined}
          {...register('phone')}
        />
        <Input
          id="company"
          label={t('company_label')}
          placeholder={t('company_placeholder')}
          error={errors.company?.message ? t(errors.company.message as Parameters<typeof t>[0]) : undefined}
          {...register('company')}
        />
      </div>

      {/* Project type + Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          id="project_type"
          label={t('project_type_label')}
          placeholder={t('project_type_placeholder')}
          required
          options={projectTypeOptions}
          error={errors.project_type?.message ? t(errors.project_type.message as Parameters<typeof t>[0]) : undefined}
          {...register('project_type')}
        />
        <Select
          id="budget"
          label={t('budget_label')}
          placeholder={t('budget_placeholder')}
          required
          options={budgetOptions}
          error={errors.budget?.message ? t(errors.budget.message as Parameters<typeof t>[0]) : undefined}
          {...register('budget')}
        />
      </div>

      {/* Message */}
      <Textarea
        id="message"
        label={t('message_label')}
        placeholder={t('message_placeholder')}
        required
        rows={6}
        error={errors.message?.message ? t(errors.message.message as Parameters<typeof t>[0]) : undefined}
        {...register('message')}
      />

      {/* Turnstile widget */}
      <div ref={turnstileRef} />
      {errors.turnstile_token && (
        <p className="text-xs text-accent-coral">Por favor completá el captcha.</p>
      )}

      {/* Submit */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <Button type="submit" size="lg" loading={isSubmitting} className="w-full sm:w-auto gap-2">
          {isSubmitting ? t('submitting') : t('submit')}
          {!isSubmitting && <ArrowRight size={16} aria-hidden="true" />}
        </Button>

        <a
          href={process.env.NEXT_PUBLIC_CALENDLY_URL ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted hover:text-primary transition-colors"
        >
          {t('or_calendly')}
        </a>
      </div>
    </form>
  );
}
