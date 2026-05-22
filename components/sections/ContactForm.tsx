'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { leadSchema, type LeadFormInput } from '@/lib/validation/leadSchema';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { ArrowRight, ArrowLeft, CheckCircle, MessageCircle } from 'lucide-react';

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

type Props = {
  whatsappNumber?: string;
};

export default function ContactForm({ whatsappNumber }: Props) {
  const t = useTranslations('contact_form');
  const locale = useLocale();
  const isEs = locale === 'es';
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const [availability, setAvailability] = useState('');
  const [waUrl, setWaUrl] = useState<string | null>(null);

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

  function buildWhatsAppUrl(data: LeadFormInput): string {
    const projectLabel =
      projectTypeOptions.find((o) => o.value === data.project_type)?.label ?? data.project_type;
    const budgetLabel =
      budgetOptions.find((o) => o.value === data.budget)?.label ?? data.budget;

    const lines = [
      isEs ? '¡Hola JDC! Quiero coordinar una reunión.' : 'Hi JDC! I’d like to set up a meeting.',
      '',
      `${isEs ? 'Nombre' : 'Name'}: ${data.name}`,
      `Email: ${data.email}`,
      data.phone ? `WhatsApp: ${data.phone}` : null,
      data.company ? `${isEs ? 'Empresa' : 'Company'}: ${data.company}` : null,
      `${isEs ? 'Tipo de proyecto' : 'Project type'}: ${projectLabel}`,
      `${isEs ? 'Presupuesto' : 'Budget'}: ${budgetLabel}`,
      availability.trim() ? `${isEs ? 'Disponibilidad' : 'Availability'}: ${availability.trim()}` : null,
      '',
      `${isEs ? 'Sobre el proyecto' : 'About the project'}:`,
      data.message,
    ].filter((l): l is string => l !== null);

    const digits = (whatsappNumber ?? '').replace(/\D/g, '');
    const text = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${digits}?text=${text}`;
  }

  async function onSubmit(data: LeadFormInput) {
    try {
      const fullMessage = (
        availability.trim() ? `${data.message}\n\n${isEs ? 'Disponibilidad' : 'Availability'}: ${availability.trim()}` : data.message
      ).slice(0, 2000);

      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, message: fullMessage }),
      });

      if (!res.ok && res.status === 429) {
        toast.error(isEs ? 'Demasiados intentos. Intentá en una hora.' : 'Too many attempts. Try again in an hour.');
        return;
      }

      const json = (await res.json()) as { ok: boolean; error?: string };

      if (!json.ok) {
        toast.error(t('error_generic'));
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
          setValue('turnstile_token', '');
        }
        return;
      }

      // Lead saved — show the WhatsApp hand-off
      setWaUrl(buildWhatsAppUrl(data));
    } catch {
      toast.error(t('error_generic'));
    }
  }

  // Success state: lead saved, hand off to WhatsApp
  if (waUrl) {
    return (
      <div className="flex flex-col items-center text-center gap-6 bg-bg-surface border border-border rounded-2xl p-8">
        <div className="w-14 h-14 rounded-full bg-[rgba(93,202,165,0.1)] border border-[rgba(93,202,165,0.2)] flex items-center justify-center">
          <CheckCircle size={28} className="text-accent-teal" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-medium text-primary">
            {isEs ? '¡Listo! Recibimos tu consulta' : 'Done! We got your message'}
          </h2>
          <p className="text-sm text-muted max-w-md leading-relaxed">
            {isEs
              ? 'Para coordinar la reunión más rápido, seguí por WhatsApp: ya te dejamos el mensaje armado con tus datos.'
              : 'To set up the meeting faster, continue on WhatsApp: we’ve prepared a message with your details.'}
          </p>
        </div>
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto gap-2">
            <MessageCircle size={18} aria-hidden="true" />
            {isEs ? 'Continuar por WhatsApp' : 'Continue on WhatsApp'}
          </Button>
        </a>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-dim hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          {isEs ? 'Volver al inicio' : 'Back to home'}
        </Link>
      </div>
    );
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

      {/* Meeting availability (optional, not stored as a separate field) */}
      <Input
        id="availability"
        label={isEs ? '¿Qué día/horario te queda cómodo para la reunión? (opcional)' : 'What day/time works for the meeting? (optional)'}
        placeholder={isEs ? 'Ej: martes a la tarde, o esta semana' : 'e.g. Tuesday afternoon, or this week'}
        value={availability}
        onChange={(e) => setAvailability(e.target.value)}
        maxLength={120}
      />

      {/* Turnstile widget */}
      <div ref={turnstileRef} />
      {errors.turnstile_token && (
        <p className="text-xs text-accent-coral">{isEs ? 'Por favor completá el captcha.' : 'Please complete the captcha.'}</p>
      )}

      {/* Submit */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <Button type="submit" size="lg" loading={isSubmitting} className="w-full sm:w-auto gap-2">
          {isSubmitting ? t('submitting') : isEs ? 'Continuar por WhatsApp' : 'Continue on WhatsApp'}
          {!isSubmitting && <ArrowRight size={16} aria-hidden="true" />}
        </Button>
        <p className="text-xs text-dim">
          {isEs
            ? 'Al enviar, te abrimos WhatsApp con tu consulta lista para mandar.'
            : 'On submit, we open WhatsApp with your message ready to send.'}
        </p>
      </div>
    </form>
  );
}
