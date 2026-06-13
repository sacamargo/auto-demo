import { cn } from '@/lib/utils';

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

export function AdminPageHeader({
  title,
  description,
  children,
  className,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        className
      )}
    >
      <div>
        <h1 className="text-3xl">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-muted">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      )}
    </div>
  );
}
