'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { updateSettingsAction } from '@/app/_actions/settings';
import { SETTING_KEYS, type SettingKey, type SettingsMap } from '@/lib/services/settingsService';

type Props = {
  initial: SettingsMap;
};

const FIELDS: { key: SettingKey; label: string; placeholder: string; type?: string }[] = [
  { key: 'contact_email', label: 'Email de contacto', placeholder: 'hola@jdcdevelopers.com', type: 'email' },
  { key: 'contact_whatsapp', label: 'WhatsApp', placeholder: '+54 9 381 ...' },
  { key: 'contact_location', label: 'Ubicación', placeholder: 'Tucumán, Argentina' },
  { key: 'social_github', label: 'GitHub', placeholder: 'https://github.com/...' },
  { key: 'social_linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/...' },
  { key: 'social_x', label: 'Twitter / X', placeholder: 'https://twitter.com/...' },
  { key: 'calendly_url', label: 'URL de Calendly', placeholder: 'https://calendly.com/...' },
];

const ERROR_MESSAGES: Record<string, string> = {
  unauthorized: 'Tu sesión expiró. Volvé a entrar.',
  rate_limit: 'Demasiados cambios seguidos. Esperá un momento.',
  validation: 'Revisá los campos: hay datos inválidos (email o URLs).',
  generic: 'Algo salió mal. Probá de nuevo.',
};

export default function ConfigForm({ initial }: Props) {
  const [values, setValues] = useState<Record<SettingKey, string>>(() => {
    const v = {} as Record<SettingKey, string>;
    for (const key of SETTING_KEYS) v[key] = initial[key] ?? '';
    return v;
  });
  const [saving, setSaving] = useState(false);

  function setValue(key: SettingKey, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateSettingsAction(values);
      if (!res.ok) {
        toast.error(ERROR_MESSAGES[res.error] ?? ERROR_MESSAGES.generic);
        return;
      }
      toast.success('Configuración guardada');
    } catch {
      toast.error(ERROR_MESSAGES.generic);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-bg-surface border border-border rounded-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {FIELDS.map((f) => (
          <Input
            key={f.key}
            id={`setting-${f.key}`}
            label={f.label}
            type={f.type ?? 'text'}
            value={values[f.key]}
            onChange={(e) => setValue(f.key, e.target.value)}
            placeholder={f.placeholder}
          />
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <Button type="submit" size="sm" loading={saving}>
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
