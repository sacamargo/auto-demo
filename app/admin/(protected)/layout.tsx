import { requireAdmin } from '@/lib/auth/admin';
import { AdminHeader } from '@/components/admin/admin-header';

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main>{children}</main>
    </div>
  );
}
