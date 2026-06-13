'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { updateLeadNotes, updateLeadStatus } from '@/lib/actions/leads';
import { getLeadStatusLabel } from '@/lib/labels';
import type { LeadFilter } from '@/lib/admin/leads';
import type { LeadStatus, LeadWithVehicle } from '@/types/database';
import { LeadStatusBadge } from '@/components/admin/lead-status-badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type LeadInboxProps = {
  leads: LeadWithVehicle[];
};

const filters: { value: LeadFilter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'nuevo', label: 'Nuevos' },
  { value: 'contactado', label: 'Contactados' },
  { value: 'cerrado', label: 'Cerrados' },
  { value: 'descartado', label: 'Descartados' },
];

const statusOptions: LeadStatus[] = [
  'nuevo',
  'contactado',
  'cerrado',
  'descartado',
];

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function LeadInbox({ leads }: LeadInboxProps) {
  const [filter, setFilter] = useState<LeadFilter>('todos');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    if (filter === 'todos') return leads;
    return leads.filter((lead) => lead.status === filter);
  }, [filter, leads]);

  const counts = useMemo(
    () => ({
      todos: leads.length,
      nuevo: leads.filter((l) => l.status === 'nuevo').length,
      contactado: leads.filter((l) => l.status === 'contactado').length,
      cerrado: leads.filter((l) => l.status === 'cerrado').length,
      descartado: leads.filter((l) => l.status === 'descartado').length,
    }),
    [leads]
  );

  function handleStatusChange(leadId: string, status: LeadStatus) {
    setPendingId(leadId);
    setFeedback(null);
    startTransition(async () => {
      const result = await updateLeadStatus(leadId, status);
      setPendingId(null);
      if (!result.success) {
        setFeedback(result.error ?? 'Error al actualizar');
      }
    });
  }

  function handleNotesSubmit(leadId: string, formData: FormData) {
    const notes = String(formData.get('admin_notes') ?? '');
    setPendingId(leadId);
    setFeedback(null);
    startTransition(async () => {
      const result = await updateLeadNotes(leadId, notes);
      setPendingId(null);
      if (result.success) {
        setFeedback('Notas guardadas');
      } else {
        setFeedback(result.error ?? 'Error al guardar');
      }
    });
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-md border border-border bg-surface p-12 text-center">
        <p className="font-serif text-xl">Sin solicitudes todavía</p>
        <p className="mt-2 text-sm text-muted">
          Los leads del formulario de contacto aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ease-out',
              filter === item.value
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-surface text-muted hover:border-foreground hover:text-foreground'
            )}
          >
            {item.label}
            <span className="ml-1.5 opacity-70">{counts[item.value]}</span>
          </button>
        ))}
      </div>

      {feedback && (
        <p className="text-sm text-accent reveal-panel" role="status">
          {feedback}
        </p>
      )}

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="rounded-md border border-border bg-surface p-8 text-center text-sm text-muted">
            No hay leads en este filtro.
          </p>
        ) : (
          filtered.map((lead) => {
            const isExpanded = expandedId === lead.id;
            const isLoading = isPending && pendingId === lead.id;

            return (
              <article
                key={lead.id}
                className={cn(
                  'rounded-md border border-border bg-surface transition-[border-color,box-shadow] duration-200 ease-out',
                  isExpanded && 'border-foreground/20 shadow-sm',
                  lead.status === 'nuevo' && !isExpanded && 'border-accent/30'
                )}
              >
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-4 p-4 text-left"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : lead.id)
                  }
                  aria-expanded={isExpanded}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{lead.name}</p>
                      <LeadStatusBadge status={lead.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted">{lead.email}</p>
                    <p className="mt-0.5 font-mono text-sm text-foreground">
                      {lead.phone}
                    </p>
                    {lead.vehicle && (
                      <p className="mt-2 text-xs text-accent">
                        Interés: {lead.vehicle.brand} {lead.vehicle.model}{' '}
                        {lead.vehicle.year}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-muted">{formatDate(lead.created_at)}</p>
                    <p className="mt-2 text-xs text-muted">
                      {isExpanded ? 'Ocultar' : 'Ver detalle'}
                    </p>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border p-4 reveal-panel">
                    {lead.message && (
                      <div className="mb-4">
                        <p className="text-xs font-medium uppercase tracking-[0.05em] text-muted">
                          Mensaje
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
                          {lead.message}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          type="button"
                          disabled={isLoading || lead.status === status}
                          onClick={() => handleStatusChange(lead.id, status)}
                          className={cn(
                            'rounded-full border px-3 py-1 text-xs transition-colors duration-200 ease-out disabled:opacity-50',
                            lead.status === status
                              ? 'border-foreground bg-foreground text-background'
                              : 'border-border text-muted hover:border-foreground hover:text-foreground'
                          )}
                        >
                          {getLeadStatusLabel(status)}
                        </button>
                      ))}
                    </div>

                    <form
                      action={(formData) => handleNotesSubmit(lead.id, formData)}
                      className="mt-4 space-y-3"
                    >
                      <label className="block">
                        <span className="text-xs font-medium uppercase tracking-[0.05em] text-muted">
                          Notas internas
                        </span>
                        <textarea
                          name="admin_notes"
                          defaultValue={lead.admin_notes}
                          rows={3}
                          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-[border-color] duration-200 focus:border-foreground"
                          placeholder="Seguimiento, próximos pasos..."
                        />
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button type="submit" size="sm" disabled={isLoading}>
                          {isLoading ? 'Guardando…' : 'Guardar notas'}
                        </Button>
                        {lead.vehicle && (
                          <Button
                            href={`/catalogo/${lead.vehicle.slug}`}
                            variant="ghost"
                            size="sm"
                          >
                            Ver vehículo
                          </Button>
                        )}
                        <Link
                          href={`mailto:${lead.email}`}
                          className="text-xs text-muted underline-offset-4 hover:text-foreground hover:underline"
                        >
                          Responder por email
                        </Link>
                        <Link
                          href={`https://wa.me/57${lead.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted underline-offset-4 hover:text-foreground hover:underline"
                        >
                          WhatsApp
                        </Link>
                      </div>
                    </form>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
