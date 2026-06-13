import Link from 'next/link';
import type { LeadWithVehicle } from '@/types/database';
import { LeadStatusBadge } from '@/components/admin/lead-status-badge';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/motion/fade-in';

type RecentLeadsPanelProps = {
  leads: LeadWithVehicle[];
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function RecentLeadsPanel({ leads }: RecentLeadsPanelProps) {
  return (
    <FadeIn delay={2} className="mt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl">Leads recientes</h2>
          <p className="mt-1 text-sm text-muted">
            Solicitudes nuevas pendientes de revisar
          </p>
        </div>
        <Button href="/admin/leads" variant="outline" size="sm">
          Ver todos
        </Button>
      </div>

      {leads.length === 0 ? (
        <div className="mt-4 rounded-md border border-border bg-surface p-8 text-center text-sm text-muted">
          No hay leads nuevos por ahora.
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-border rounded-md border border-border bg-surface">
          {leads.map((lead) => (
            <li key={lead.id}>
              <Link
                href="/admin/leads"
                className="flex flex-col gap-2 p-4 transition-colors duration-200 ease-out hover:bg-background sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{lead.name}</p>
                    <LeadStatusBadge status={lead.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted">{lead.email}</p>
                  {lead.vehicle && (
                    <p className="mt-1 text-xs text-accent">
                      {lead.vehicle.brand} {lead.vehicle.model} {lead.vehicle.year}
                    </p>
                  )}
                </div>
                <p className="shrink-0 text-xs text-muted">
                  {formatDate(lead.created_at)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </FadeIn>
  );
}
