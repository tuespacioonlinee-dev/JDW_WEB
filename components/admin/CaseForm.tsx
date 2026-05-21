'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { createCaseAction, updateCaseAction, uploadCaseImageAction } from '@/app/_actions/cases';
import type { CaseColor, CaseMetric, CaseStudy } from '@/types/case';

type Props = {
  initial?: CaseStudy | null;
  onClose: () => void;
  onSaved: (saved: CaseStudy) => void;
};

const COLORS: { value: CaseColor; className: string }[] = [
  { value: 'teal', className: 'bg-accent-teal' },
  { value: 'purple', className: 'bg-accent-purple' },
  { value: 'coral', className: 'bg-accent-coral' },
  { value: 'pink', className: 'bg-accent-pink' },
];

const ERROR_MESSAGES: Record<string, string> = {
  unauthorized: 'Tu sesión expiró. Volvé a entrar.',
  rate_limit: 'Demasiados cambios seguidos. Esperá un momento.',
  validation: 'Revisá los campos: hay datos inválidos.',
  too_large: 'La imagen supera los 4 MB.',
  bad_type: 'Formato no permitido. Usá JPG, PNG, WEBP o AVIF.',
  generic: 'Algo salió mal. Probá de nuevo.',
};

const inputBase =
  'w-full bg-bg-base border border-border rounded-lg px-3 py-2 text-sm text-primary placeholder:text-dim focus:outline-none focus:border-accent-purple transition-colors';

export default function CaseForm({ initial, onClose, onSaved }: Props) {
  const isEdit = !!initial;
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initial?.name ?? '');
  const [categoryEs, setCategoryEs] = useState(initial?.category_es ?? '');
  const [categoryEn, setCategoryEn] = useState(initial?.category_en ?? '');
  const [descEs, setDescEs] = useState(initial?.description_es ?? '');
  const [descEn, setDescEn] = useState(initial?.description_en ?? '');
  const [metrics, setMetrics] = useState<CaseMetric[]>(initial?.metrics ?? []);
  const [imageUrl, setImageUrl] = useState<string | null>(initial?.image_url ?? null);
  const [color, setColor] = useState<CaseColor>(initial?.color ?? 'teal');
  const [order, setOrder] = useState(initial?.display_order ?? 0);
  const [published, setPublished] = useState(initial?.published ?? true);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function fail(error: string) {
    toast.error(ERROR_MESSAGES[error] ?? ERROR_MESSAGES.generic);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadCaseImageAction(fd);
      if (!res.ok) {
        fail(res.error);
        return;
      }
      setImageUrl(res.data!.url);
      toast.success('Imagen subida');
    } catch {
      fail('generic');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function updateMetric(index: number, key: keyof CaseMetric, value: string) {
    setMetrics((prev) => prev.map((m, i) => (i === index ? { ...m, [key]: value } : m)));
  }

  function addMetric() {
    if (metrics.length >= 6) return;
    setMetrics((prev) => [...prev, { label_es: '', label_en: '' }]);
  }

  function removeMetric(index: number) {
    setMetrics((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('El nombre es obligatorio.');
      return;
    }

    const payload = {
      name: name.trim(),
      category_es: categoryEs.trim(),
      category_en: categoryEn.trim(),
      description_es: descEs.trim(),
      description_en: descEn.trim(),
      metrics: metrics
        .filter((m) => m.label_es.trim() || m.label_en.trim())
        .map((m) => ({ label_es: m.label_es.trim(), label_en: m.label_en.trim() })),
      image_url: imageUrl,
      color,
      display_order: order,
      published,
    };

    setSaving(true);
    try {
      if (isEdit && initial) {
        const res = await updateCaseAction({ id: initial.id, ...payload });
        if (!res.ok) {
          fail(res.error);
          return;
        }
        onSaved({ ...initial, ...payload });
        toast.success('Caso actualizado');
      } else {
        const res = await createCaseAction(payload);
        if (!res.ok) {
          fail(res.error);
          return;
        }
        const now = new Date().toISOString();
        onSaved({
          id: res.data!.id,
          ...payload,
          created_at: now,
          updated_at: now,
        });
        toast.success('Caso creado');
      }
      onClose();
    } catch {
      fail('generic');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm px-4 py-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-bg-surface border border-border rounded-2xl p-6 w-full max-w-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-primary">
            {isEdit ? 'Editar caso' : 'Nuevo caso'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-dim hover:text-primary"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            id="case-name"
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ofikio"
            required
            maxLength={120}
          />

          {/* Image */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted">Imagen</span>
            <div className="flex items-center gap-4">
              <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-bg-base border border-border shrink-0">
                {imageUrl ? (
                  <Image src={imageUrl} alt="" fill className="object-cover" sizes="160px" />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-dim">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFile}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  loading={uploading}
                  onClick={() => fileRef.current?.click()}
                  className="gap-2"
                >
                  <Upload size={14} />
                  {imageUrl ? 'Cambiar imagen' : 'Subir imagen'}
                </Button>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl(null)}
                    className="text-xs text-dim hover:text-accent-coral transition-colors text-left"
                  >
                    Quitar imagen
                  </button>
                )}
                <span className="text-xs text-dim">JPG, PNG, WEBP o AVIF. Máx 4 MB.</span>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="case-cat-es"
              label="Categoría (ES)"
              value={categoryEs}
              onChange={(e) => setCategoryEs(e.target.value)}
              placeholder="CRM a medida"
              maxLength={80}
            />
            <Input
              id="case-cat-en"
              label="Categoría (EN)"
              value={categoryEn}
              onChange={(e) => setCategoryEn(e.target.value)}
              placeholder="Custom CRM"
              maxLength={80}
            />
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="case-desc-es" className="text-sm font-medium text-muted">
                Descripción (ES)
              </label>
              <textarea
                id="case-desc-es"
                value={descEs}
                onChange={(e) => setDescEs(e.target.value)}
                rows={4}
                maxLength={1000}
                className={`${inputBase} resize-y`}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="case-desc-en" className="text-sm font-medium text-muted">
                Descripción (EN)
              </label>
              <textarea
                id="case-desc-en"
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                rows={4}
                maxLength={1000}
                className={`${inputBase} resize-y`}
              />
            </div>
          </div>

          {/* Metrics */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted">Métricas (chips)</span>
              <button
                type="button"
                onClick={addMetric}
                disabled={metrics.length >= 6}
                className="flex items-center gap-1 text-xs text-accent-teal hover:text-primary transition-colors disabled:opacity-40"
              >
                <Plus size={12} />
                Agregar
              </button>
            </div>
            {metrics.length === 0 && (
              <p className="text-xs text-dim">Sin métricas. Ej: &quot;212 materiales&quot;.</p>
            )}
            {metrics.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={m.label_es}
                  onChange={(e) => updateMetric(i, 'label_es', e.target.value)}
                  placeholder="ES — 212 materiales"
                  maxLength={60}
                  className={inputBase}
                />
                <input
                  value={m.label_en}
                  onChange={(e) => updateMetric(i, 'label_en', e.target.value)}
                  placeholder="EN — 212 items"
                  maxLength={60}
                  className={inputBase}
                />
                <button
                  type="button"
                  onClick={() => removeMetric(i)}
                  className="text-dim hover:text-accent-coral transition-colors shrink-0"
                  aria-label="Quitar métrica"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Color + order + published */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted">Color</span>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    aria-label={c.value}
                    className={`w-7 h-7 rounded-full ${c.className} transition-all ${
                      color === c.value
                        ? 'ring-2 ring-offset-2 ring-offset-bg-surface ring-primary'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="case-order" className="text-sm font-medium text-muted">
                Orden
              </label>
              <input
                id="case-order"
                type="number"
                min={0}
                max={9999}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value) || 0)}
                className={inputBase}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none py-2">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 accent-accent-purple"
              />
              <span className="text-sm text-muted">Publicado</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" loading={saving} disabled={uploading}>
              {isEdit ? 'Guardar cambios' : 'Crear caso'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
