'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import CaseForm from '@/components/admin/CaseForm';
import { deleteCaseAction } from '@/app/_actions/cases';
import type { CaseStudy } from '@/types/case';

type Props = {
  initialCases: CaseStudy[];
};

export default function CasesManager({ initialCases }: Props) {
  const [cases, setCases] = useState(initialCases);
  const [editing, setEditing] = useState<CaseStudy | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleSaved(saved: CaseStudy) {
    setCases((prev) => {
      const exists = prev.some((c) => c.id === saved.id);
      const next = exists
        ? prev.map((c) => (c.id === saved.id ? saved : c))
        : [...prev, saved];
      return next.sort(
        (a, b) =>
          a.display_order - b.display_order ||
          b.created_at.localeCompare(a.created_at),
      );
    });
  }

  async function handleDelete(c: CaseStudy) {
    if (!confirm(`¿Borrar el caso "${c.name}"? Esta acción no se puede deshacer.`)) return;

    setDeletingId(c.id);
    try {
      const res = await deleteCaseAction(c.id);
      if (!res.ok) {
        toast.error('No se pudo borrar el caso.');
        return;
      }
      setCases((prev) => prev.filter((x) => x.id !== c.id));
      toast.success('Caso borrado');
    } catch {
      toast.error('No se pudo borrar el caso.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-primary">Casos de éxito</h1>
          <p className="text-sm text-muted mt-1">
            Gestioná los proyectos que aparecen en la página de Trabajo.
          </p>
        </div>
        <Button size="sm" onClick={() => setCreating(true)} className="gap-2">
          <Plus size={16} />
          Nuevo caso
        </Button>
      </div>

      {cases.length === 0 ? (
        <div className="bg-bg-surface border border-border rounded-xl p-12 text-center">
          <p className="text-muted">Todavía no hay casos. Creá el primero.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((c) => (
            <div
              key={c.id}
              className="bg-bg-surface border border-border rounded-xl overflow-hidden flex flex-col"
            >
              <div className="relative aspect-video bg-bg-base">
                {c.image_url ? (
                  <Image
                    src={c.image_url}
                    alt={c.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-dim">
                    Sin imagen
                  </div>
                )}
                {!c.published && (
                  <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full bg-bg-elevated/90 text-dim border border-border">
                    Borrador
                  </span>
                )}
              </div>

              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base font-medium text-primary">{c.name}</h2>
                  <span className="text-xs text-dim shrink-0">#{c.display_order}</span>
                </div>
                {c.category_es && (
                  <span className="text-xs text-accent-teal">{c.category_es}</span>
                )}
                <p className="text-xs text-muted line-clamp-2">{c.description_es}</p>

                <div className="flex gap-2 mt-auto pt-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setEditing(c)}
                    className="gap-1.5 flex-1"
                  >
                    <Pencil size={14} />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    loading={deletingId === c.id}
                    onClick={() => handleDelete(c)}
                    aria-label="Borrar"
                    className="text-dim hover:text-accent-coral"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {creating && (
        <CaseForm onClose={() => setCreating(false)} onSaved={handleSaved} />
      )}
      {editing && (
        <CaseForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
