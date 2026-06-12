import { cn } from '@/lib/utils';

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  narrow?: boolean;
};

export function Container({ narrow, className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-6 md:px-12',
        narrow ? 'max-w-4xl' : 'max-w-content',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
