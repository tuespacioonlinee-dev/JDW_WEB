'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { revalidateContent } from '@/app/_actions/content';
import type { SiteContent } from '@/types/content';
import type { Locale } from '@/types/locale';

type Props = {
  item: SiteContent;
  onSaved?: (newValue: string) => void;
};

export default function FieldEditor({ item, onSaved }: Props) {
  const [value, setValue] = useState(item.value);
  const [saving, setSaving] = useState(false);
  const isMultiline = value.length > 80;

  async function handleSave() {
    if (saving || value === item.value) return;
    setSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, locale: item.locale as Locale, value }),
      });

      if (!res.ok) {
        // TEMP DEBUG — read raw body as text so we see Vercel's HTML error page too
        const raw = await res.text().catch(() => '<no body>');
        const snippet = raw.slice(0, 400);
        toast.error(`HTTP ${res.status}: ${snippet}`, { duration: 30000 });
        return;
      }

      await revalidateContent();
      onSaved?.(value);
      toast.success('Guardado');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown';
      toast.error(`Error: ${msg}`, { duration: 15000 });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-dim">{item.field}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
          item.locale === 'es'
            ? 'bg-[rgba(93,202,165,0.1)] text-accent-teal'
            : 'bg-[rgba(127,119,221,0.1)] text-accent-purple'
        }`}>
          {item.locale.toUpperCase()}
        </span>
      </div>

      {isMultiline ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          className="w-full bg-bg-base border border-border rounded-lg px-3 py-2 text-sm text-primary placeholder:text-dim resize-y focus:outline-none focus:border-accent-purple transition-colors"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-bg-base border border-border rounded-lg px-3 py-2 text-sm text-primary placeholder:text-dim focus:outline-none focus:border-accent-purple transition-colors"
        />
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || value === item.value}
          className="text-xs px-3 py-1.5 bg-accent-purple hover:bg-accent-purple/80 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}
