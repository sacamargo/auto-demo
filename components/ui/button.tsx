import Link from 'next/link';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-foreground text-surface hover:bg-[#333333] border border-foreground',
  secondary:
    'bg-surface text-foreground border border-border hover:border-foreground',
  ghost: 'bg-transparent text-foreground hover:bg-black/[0.03]',
  outline:
    'bg-transparent text-foreground border border-border hover:border-foreground',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-xs tracking-wide',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-8 text-sm',
};

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
} & (
  | React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
  | { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
);

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  href,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center font-sans font-medium transition-colors duration-200 ease-out rounded-sm pressable',
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (href) {
    const isExternal =
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:');

    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={classes}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
