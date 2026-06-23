import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn('inline-flex items-baseline gap-0.5', className)}>
      <svg
        viewBox="0 0 160 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-auto text-foreground min-[375px]:h-7"
        aria-label={siteConfig.name}
      >
        <text
          x="0"
          y="26"
          className="fill-current font-serif text-[28px]"
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          Auto
        </text>
        <text
          x="62"
          y="26"
          className="fill-current font-serif text-[28px] italic"
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          Demo
        </text>
      </svg>
    </Link>
  );
}