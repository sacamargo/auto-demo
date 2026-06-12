import { siteConfig } from '@/config/site';
import { LoginForm } from '@/components/admin/login-form';
import { Container } from '@/components/layout/container';

export const metadata = {
  title: 'Ingresar',
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <Container narrow className="max-w-md">
        <div className="rounded-md border border-border bg-surface p-8 md:p-10">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
            Panel de administración
          </p>
          <h1 className="mt-3 font-serif text-3xl">{siteConfig.name}</h1>
          <p className="mt-2 text-sm text-muted">
            Ingresa con tu cuenta de administrador para gestionar el inventario.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
