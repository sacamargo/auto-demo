import { cn } from '@/lib/utils';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8 md:p-10',
};

export function Card({
  hover = false,
  padding = 'md',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-border bg-surface',
        paddingStyles[padding],
        hover && 'card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
