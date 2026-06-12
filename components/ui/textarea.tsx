import { cn } from '@/lib/utils';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={textareaId} className="block text-sm text-foreground">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'min-h-[120px] w-full resize-y rounded-sm border border-border bg-surface px-4 py-3 text-sm text-foreground',
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
