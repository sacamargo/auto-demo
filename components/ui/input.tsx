import { cn } from '@/lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm text-foreground">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'h-11 w-full rounded-sm border border-border bg-surface px-4 text-sm text-foreground',
          'placeholder:text-muted transition-colors duration-200 ease-out',
          'focus:border-foreground focus:outline-none focus:ring-0',
          error && 'border-[var(--status-sold-text)]',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-[var(--status-sold-text)]">{error}</p>
      )}
    </div>
  );
}
