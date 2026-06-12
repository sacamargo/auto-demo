import { cn } from '@/lib/utils';
import type { VehicleStatus } from '@/types/database';
import { getStatusLabel } from '@/lib/labels';

const statusStyles: Record<VehicleStatus, string> = {
  disponible:
    'bg-[var(--status-available-bg)] text-[var(--status-available-text)]',
  reservado:
    'bg-[var(--status-reserved-bg)] text-[var(--status-reserved-text)]',
  vendido: 'bg-[var(--status-sold-bg)] text-[var(--status-sold-text)]',
};

type BadgeProps = {
  status?: VehicleStatus;
  children?: React.ReactNode;
  className?: string;
};

export function Badge({ status, children, className }: BadgeProps) {
  const label = status ? getStatusLabel(status) : children;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.05em]',
        status ? statusStyles[status] : 'bg-background text-muted',
        className
      )}
    >
      {label}
    </span>
  );
}
