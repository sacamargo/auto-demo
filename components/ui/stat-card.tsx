import { cn } from '@/lib/utils';

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
  className?: string;
};

export function StatCard({
  label,
  value,
  hint,
  accent,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-border bg-surface p-5 card-hover',
        accent && 'border-accent/30 bg-accent/5',
        className
      )}
    >
      <p className="text-xs font-medium uppercase tracking-[0.05em] text-muted">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl tracking-tight text-foreground">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
