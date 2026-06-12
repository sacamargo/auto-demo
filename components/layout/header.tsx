'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { Logo } from '@/components/layout/logo';

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/comparar', label: 'Comparar' },
  { href: '/#contacto', label: 'Contacto' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-200 ease-out',
        scrolled
          ? 'border-b border-border bg-background/90 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <Container>
        <div className="flex h-[var(--header-height)] items-center justify-between gap-6">
          <Logo />

          <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted transition-colors duration-200 ease-out hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button href="/catalogo" variant="primary" size="sm">
              Ver catálogo
            </Button>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center md:hidden"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="relative block h-3 w-5">
              <span
                className={cn(
                  'absolute left-0 top-0 block h-px w-5 bg-foreground transition-transform duration-200 ease-out',
                  menuOpen && 'translate-y-1.5 rotate-45'
                )}
              />
              <span
                className={cn(
                  'absolute left-0 top-1.5 block h-px w-5 bg-foreground transition-opacity duration-200 ease-out',
                  menuOpen && 'opacity-0'
                )}
              />
              <span
                className={cn(
                  'absolute left-0 top-3 block h-px w-5 bg-foreground transition-transform duration-200 ease-out',
                  menuOpen && '-translate-y-1.5 -rotate-45'
                )}
              />
            </span>
          </button>
        </div>

        {menuOpen && (
          <nav
            className="border-t border-border py-6 md:hidden"
            aria-label="Móvil"
          >
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block text-base text-foreground"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Button href="/catalogo" variant="primary" className="w-full">
                  Ver catálogo
                </Button>
              </li>
            </ul>
          </nav>
        )}
      </Container>
    </header>
  );
}
