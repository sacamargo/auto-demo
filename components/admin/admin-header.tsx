import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { getLeadStatsAdmin } from '@/lib/admin/leads';
import { signOutAdmin } from '@/lib/actions/auth';
import { AdminNav } from '@/components/admin/admin-nav';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';

export async function AdminHeader() {
  let nuevosCount = 0;

  try {
    const stats = await getLeadStatsAdmin();
    nuevosCount = stats.nuevo;
  } catch {
    nuevosCount = 0;
  }

  return (
    <header className="border-b border-border bg-surface">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/admin/vehiculos" className="font-serif text-lg">
              {siteConfig.name}
            </Link>
            <AdminNav nuevosCount={nuevosCount} />
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
