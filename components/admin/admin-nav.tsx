'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type AdminNavProps = {
  nuevosCount: number;
};

const navItems = [
  { href: '/admin', label: 'Panel', match: '/admin' },
  { href: '/admin/vehiculos', label: 'Inventario', match: '/admin/vehiculos' },
  { href: '/admin/leads', label: 'Leads', match: '/admin/leads', badge: true },
  { href: '/admin/vehiculos/nuevo', label: 'Agregar vehículo', match: '/admin/vehiculos/nuevo' },
];

function isActive(pathname: string, match: string) {
  if (match === '/admin') {
    return pathname === '/admin';
  }
  if (match === '/admin/vehiculos') {
    return (
      pathname.startsWith('/admin/vehiculos') &&
      pathname !== '/admin/vehiculos/nuevo'
    );
  }
  return pathname.startsWith(match);
}

export function AdminNav({ nuevosCount }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-6 lg:flex">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'inline-flex items-center gap-1.5 text-sm transition-colors duration-200 ease-out',
            isActive(pathname, item.match)
              ? 'text-foreground'
              : 'text-muted hover:text-foreground'
          )}
        >
          {item.label}
          {item.badge && nuevosCount > 0 && (
            <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-medium text-white">
              {nuevosCount}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}
