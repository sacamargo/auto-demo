import { cn } from '@/lib/utils';
import { getLeadStatusLabel } from '@/lib/labels';
import type { LeadStatus } from '@/types/database';

const leadStatusStyles: Record<LeadStatus, string> = {
  nuevo: 'bg-accent/15 text-accent',
  contactado: 'bg-[var(--status-reserved-bg)] text-[var(--status-reserved-text)]',
  cerrado: 'bg-[var(--status-available-bg)] text-[var(--status-available-text)]',
  descartado: 'bg-background text-muted border border-border',
};

type LeadStatusBadgeProps = {
  status: LeadStatus;
  className?: string;
};

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.05em]',
        leadStatusStyles[status],
        className
      )}
    >
      {getLeadStatusLabel(status)}
    </span>
  );
}
