import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';

export default function VehicleNotFound() {
  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-section text-center">
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
        404
      </p>
      <h1 className="mt-4 font-serif text-4xl">Vehículo no encontrado</h1>
      <p className="mt-4 max-w-md text-muted">
        Este vehículo no está disponible o ya no forma parte del inventario.
      </p>
      <Button href="/catalogo" className="mt-8">
        Ver catálogo
      </Button>
    </Container>
  );
}
