import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Container } from '@/components/layout/container';

export const metadata = {
  title: 'Design System',
};

export default function DesignSystemPage() {
  return (
    <div className="bg-background py-section">
      <Container narrow className="space-y-16">
        <header className="space-y-3 border-b border-border pb-10">
          <p className="text-xs uppercase tracking-[0.15em] text-muted">Interno</p>
          <h1 className="text-4xl">Sistema de diseño</h1>
          <p className="text-muted">
            Tokens, tipografía y componentes base de {`AutoDemo`}.
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="text-2xl">Tipografía</h2>
          <div className="space-y-4 border border-border bg-surface p-8">
            <p className="font-serif text-5xl tracking-tight">Instrument Serif — Display</p>
            <p className="font-sans text-lg">DM Sans — Cuerpo y navegación</p>
            <p className="font-mono text-lg">$245.000.000 — JetBrains Mono</p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl">Botones</h2>
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl">Input</h2>
          <div className="max-w-md">
            <Input label="Nombre completo" placeholder="María González" />
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge status="disponible" />
            <Badge status="reservado" />
            <Badge status="vendido" />
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl">Card</h2>
          <Card hover className="max-w-md">
            <p className="font-serif text-xl">Tarjeta editorial</p>
            <p className="mt-2 text-sm text-muted">
              Borde 1px, sin sombra exagerada. Hover sutil en desktop.
            </p>
          </Card>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl">Paleta</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { name: 'Background', className: 'bg-background' },
              { name: 'Surface', className: 'bg-surface' },
              { name: 'Foreground', className: 'bg-foreground' },
              { name: 'Accent', className: 'bg-accent' },
            ].map((swatch) => (
              <div key={swatch.name} className="space-y-2">
                <div className={`h-16 rounded-md border border-border ${swatch.className}`} />
                <p className="text-xs text-muted">{swatch.name}</p>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
