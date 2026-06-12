import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { signOutAdmin } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';

export function AdminHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/admin/vehiculos" className="font-serif text-lg">
              {siteConfig.name}
            </Link>
            <nav className="hidden items-center gap-6 sm:flex">
              <Link
                href="/admin/vehiculos"
                className="text-sm text-muted transition-colors duration-200 ease-out hover:text-foreground"
              >
                Inventario
              </Link>
              <Link
                href="/admin/vehiculos/nuevo"
                className="text-sm text-muted transition-colors duration-200 ease-out hover:text-foreground"
              >
                Agregar vehículo
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button href="/" variant="ghost" size="sm">
              Ver sitio
            </Button>
            <form action={signOutAdmin}>
              <Button type="submit" variant="outline" size="sm">
                Cerrar sesión
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </header>
  );
}
