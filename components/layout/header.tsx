'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { Logo } from '@/components/layout/logo';

const navItems = [
  { href: '/', label: 'Inicio', match: (path: string) => path === '/' },
  {
    href: '/catalogo',
    label: 'Catálogo',
    match: (path: string) => path.startsWith('/catalogo'),
  },
  {
    href: '/financiacion',
    label: 'Financiación',
    match: (path: string) =>
      path === '/financiacion' || path.endsWith('/financiacion'),
  },
  {
    href: '/comparar',
    label: 'Comparar',
    match: (path: string) => path.startsWith('/comparar'),
  },
  {
    href: '/#contacto',
    label: 'Contacto',
    match: () => false,
  },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'site-header transition-[box-shadow] duration-200 ease-out',
          scrolled && 'site-header-scrolled',
          menuOpen && 'site-header-open'
        )}
      >
        <Container className="relative">
          <div className="site-header-bar">
            <Logo className="shrink-0" />

            <nav
              className="hidden items-center gap-5 lg:flex laptop-l:gap-8"
              aria-label="Principal"
            >
              {navItems.map((item) => {
                const active = item.match(pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'text-sm transition-colors duration-200 ease-out',
                      active
                        ? 'font-medium text-foreground'
                        : 'text-foreground/75 hover:text-foreground'
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden shrink-0 lg:block">
              <Button href="/catalogo" variant="primary" size="sm">
                Ver catálogo
              </Button>
            </div>

            <button
              type="button"
              className="site-header-menu-btn lg:hidden"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="relative block h-3 w-5">
                <span
                  className={cn(
                    'absolute left-0 top-0 block h-0.5 w-5 rounded-full bg-foreground transition-transform duration-200 ease-out',
                    menuOpen && 'translate-y-1.5 rotate-45'
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-1.5 block h-0.5 w-5 rounded-full bg-foreground transition-opacity duration-200 ease-out',
                    menuOpen && 'opacity-0'
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-3 block h-0.5 w-5 rounded-full bg-foreground transition-transform duration-200 ease-out',
                    menuOpen && '-translate-y-1.5 -rotate-45'
                  )}
                />
              </span>
            </button>
          </div>
        </Container>
      </header>

      {menuOpen && (
        <>
          <button
            type="button"
            className="site-header-backdrop lg:hidden"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="site-header-drawer lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            <Container className="py-5 min-[375px]:py-6">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const active = item.match(pathname);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'block rounded-md px-3 py-3.5 text-base transition-colors duration-200 ease-out min-[375px]:py-4',
                          active
                            ? 'bg-foreground/[0.07] font-medium text-foreground ring-1 ring-border'
                            : 'text-foreground/90 hover:bg-foreground/[0.04]'
                        )}
                        onClick={() => setMenuOpen(false)}
                        aria-current={active ? 'page' : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
                <li className="border-t border-border pt-5">
                  <Button href="/catalogo" variant="primary" className="w-full">
                    Ver catálogo
                  </Button>
                </li>
              </ul>
            </Container>
          </div>
        </>
      )}
    </>
  );
}
