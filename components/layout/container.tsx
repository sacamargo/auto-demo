import { cn } from '@/lib/utils';

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  narrow?: boolean;
};

export function Container({ narrow, className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-gutter',
        narrow ? 'max-w-4xl' : 'max-w-content 4k:max-w-content-wide',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
