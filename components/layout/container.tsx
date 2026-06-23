import { cn } from '@/lib/utils';

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  narrow?: boolean;
};

export function Container({ narrow, className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-full',
        'ps-[max(var(--page-gutter),env(safe-area-inset-left))]',
        'pe-[max(var(--page-gutter),env(safe-area-inset-right))]',
        narrow ? 'max-w-4xl' : 'max-w-content 4k:max-w-content-wide',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
