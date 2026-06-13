import { getDashboardStats } from '@/lib/admin/dashboard';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { Container } from '@/components/layout/container';

export const metadata = {
  title: 'Panel',
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <Container className="py-10">
      <AdminDashboard stats={stats} />
    </Container>
  );
}
