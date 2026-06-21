import { requireAdmin } from '@/lib/auth/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSileoProvider } from '@/components/admin/admin-sileo-provider';

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <AdminSileoProvider>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main>{children}</main>
      </div>
    </AdminSileoProvider>
  );
}
