'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { Lead, LeadStatus } from '@/types/lead';

type Props = {
  leads: Lead[];
};

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: 'bg-[rgba(93,202,165,0.1)] text-accent-teal border-[rgba(93,202,165,0.2)]',
  contacted: 'bg-[rgba(240,208,0,0.1)] text-yellow-400 border-yellow-400/20',
  won: 'bg-[rgba(93,202,165,0.15)] text-accent-teal border-[rgba(93,202,165,0.3)]',
  lost: 'bg-bg-elevated text-dim border-border',
};

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  won: 'Ganado',
  lost: 'Perdido',
};

const PROJECT_LABELS: Record<string, string> = {
  saas: 'SaaS/CRM',
  web: 'Web',
  chatbot: 'Chatbot/IA',
  integration: 'Integración',
  other: 'Otro',
};

export default function LeadsTable({ leads: initialLeads }: Props) {
  const [leads, setLeads] = useState(initialLeads);
  const [selected, setSelected] = useState<Lead | null>(null);

  async function updateStatus(id: string, status: LeadStatus) {
    try {
      const res = await fetch('/api/leads/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) throw new Error('Failed');

      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status } : l)),
      );

      if (selected?.id === id) {
        setSelected((prev) => prev ? { ...prev, status } : null);
      }

      toast.success('Estado actualizado');
    } catch {
      toast.error('Error al actualizar el estado');
    }
  }

  if (leads.length === 0) {
    return (
      <div className="bg-bg-surface border border-border rounded-xl p-12 text-center">
        <p className="text-muted">No hay leads en este filtro.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm" aria-label="Lista de leads">
          <thead>
            <tr className="border-b border-border">
              {['Fecha', 'Nombre', 'Email', 'Tipo', 'Presupuesto', 'Idioma', 'Estado'].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-dim uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => setSelected(lead)}
                className="border-b border-border last:border-0 hover:bg-bg-elevated cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-dim whitespace-nowrap">
                  {new Date(lead.created_at).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                  })}
                </td>
                <td className="px-4 py-3 text-primary font-medium">{lead.name}</td>
                <td className="px-4 py-3 text-muted">{lead.email}</td>
                <td className="px-4 py-3 text-muted">
                  {PROJECT_LABELS[lead.project_type] ?? lead.project_type}
                </td>
                <td className="px-4 py-3 text-muted">{lead.budget}</td>
                <td className="px-4 py-3">
                  <span className="text-xs uppercase font-medium text-dim">{lead.locale}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${STATUS_STYLES[lead.status]}`}
                  >
                    {STATUS_LABELS[lead.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-bg-elevated border border-border rounded-2xl p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-primary">{selected.name}</h2>
                <a
                  href={`mailto:${selected.email}`}
                  className="text-sm text-accent-teal hover:underline"
                >
                  {selected.email}
                </a>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-dim hover:text-primary text-xl leading-none"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              {selected.phone && (
                <div className="flex gap-2">
                  <span className="text-dim w-28">WhatsApp:</span>
                  <span className="text-muted">{selected.phone}</span>
                </div>
              )}
              {selected.company && (
                <div className="flex gap-2">
                  <span className="text-dim w-28">Empresa:</span>
                  <span className="text-muted">{selected.company}</span>
                </div>
              )}
              <div className="flex gap-2">
                <span className="text-dim w-28">Tipo:</span>
                <span className="text-muted">{PROJECT_LABELS[selected.project_type]}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-dim w-28">Presupuesto:</span>
                <span className="text-muted">{selected.budget}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-dim w-28">Idioma:</span>
                <span className="text-muted uppercase text-xs">{selected.locale}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-dim">Mensaje:</span>
                <p className="text-muted leading-relaxed bg-bg-surface border border-border rounded-lg p-3 text-xs whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs text-dim mb-2">Cambiar estado:</p>
              <div className="flex flex-wrap gap-2">
                {(['new', 'contacted', 'won', 'lost'] as LeadStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-colors border ${
                      selected.status === s
                        ? STATUS_STYLES[s]
                        : 'bg-bg-surface border-border text-muted hover:text-primary'
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
