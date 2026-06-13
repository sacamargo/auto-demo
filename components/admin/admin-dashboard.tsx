import Link from 'next/link';
import type { DashboardStats } from '@/lib/admin/dashboard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { RecentLeadsPanel } from '@/components/admin/recent-leads-panel';
import { FadeIn } from '@/components/motion/fade-in';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';

type AdminDashboardProps = {
  stats: DashboardStats;
};

export function AdminDashboard({ stats }: AdminDashboardProps) {
  return (
    <>
      <AdminPageHeader
        title="Panel"
        description="Resumen de inventario y solicitudes de contacto"
      >
        <Button href="/admin/vehiculos/nuevo" size="sm">
          Agregar vehículo
        </Button>
      </AdminPageHeader>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <FadeIn delay={0}>
          <Link href="/admin/leads" className="block">
            <StatCard
              label="Leads nuevos"
              value={stats.nuevosCount}
              hint="Pendientes de contactar"
              accent={stats.nuevosCount > 0}
            />
          </Link>
        </FadeIn>
        <FadeIn delay={1}>
          <Link href="/admin/leads" className="block">
            <StatCard
              label="Leads esta semana"
              value={stats.leadsThisWeek}
              hint={`${stats.totalLeads} en total`}
            />
          </Link>
        </FadeIn>
        <FadeIn delay={2}>
          <Link href="/admin/vehiculos" className="block">
            <StatCard
              label="Disponibles"
              value={stats.disponibles}
              hint={`${stats.reservados} reservados`}
            />
          </Link>
        </FadeIn>
        <FadeIn delay={3}>
          <Link href="/admin/vehiculos" className="block">
            <StatCard
              label="Inventario"
              value={stats.totalVehicles}
              hint="Todos los estados"
            />
          </Link>
        </FadeIn>
      </div>

      <RecentLeadsPanel leads={stats.recentLeads} />

      <FadeIn delay={3} className="mt-10">
        <div className="rounded-md border border-border bg-surface p-6">
          <h2 className="text-sm font-medium uppercase tracking-[0.05em] text-muted">
            Acciones rápidas
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button href="/admin/leads" variant="outline" size="sm">
              Revisar leads
            </Button>
            <Button href="/admin/vehiculos" variant="outline" size="sm">
              Ver inventario
            </Button>
            <Button href="/" variant="ghost" size="sm">
              Ver sitio público
            </Button>
          </div>
        </div>
      </FadeIn>
    </>
  );
}
