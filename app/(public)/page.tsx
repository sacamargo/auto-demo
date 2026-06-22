import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { resolveImageUrl } from '@/lib/vehicles';
import { getFeaturedVehicles } from '@/lib/vehicles.server';
import { QuoteForm } from '@/components/forms/quote-form';
import { HomeLocationSection } from '@/components/content/home-location-section';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { VehicleCard } from '@/components/catalog/vehicle-card';

export default async function HomePage() {
  const featured = await getFeaturedVehicles();
  const heroVehicle = featured[0];
  const heroImage = heroVehicle?.vehicle_images?.[0];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 70% 20%, var(--accent), transparent)',
          }}
        />
        <Container className="py-section-lg">
          <div className="grid items-center gap-10 md:gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 laptop-l:gap-20">
            <div className="fade-in max-w-xl">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
                Concesionario premium
              </p>
              <h1 className="page-title-lg mt-4 text-foreground min-[375px]:mt-6">
                Vehículos seleccionados, no listados
              </h1>
              <p className="mt-4 text-base text-muted min-[375px]:mt-6 min-[375px]:text-lg">
                {siteConfig.name} cura cada unidad con el mismo criterio de una
                galería editorial. Sin ruido, sin urgencia artificial — solo
                inventario real y atención directa.
              </p>
              <div className="action-stack mt-8 min-[375px]:mt-10">
                <Button href="/catalogo" size="lg" className="action-btn">
                  Explorar catálogo
                </Button>
                <Button href="/#contacto" variant="outline" size="lg" className="action-btn">
                  Solicitar cotización
                </Button>
              </div>
            </div>

            {heroVehicle && heroImage && (
              <div className="fade-in fade-in-delay-1 relative aspect-[4/5] max-h-[70vh] overflow-hidden rounded-md border border-border bg-surface min-[768px]:max-h-none">
                <Image
                  src={resolveImageUrl(
                    heroImage.storage_path,
                    process.env.NEXT_PUBLIC_SUPABASE_URL
                  )}
                  alt={`${heroVehicle.brand} ${heroVehicle.model}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 min-[375px]:p-6 md:p-8">
                  <p className="text-xs uppercase tracking-[0.1em] text-white/70">
                    Destacado
                  </p>
                  <p className="mt-1 font-serif text-xl text-white min-[375px]:text-2xl">
                    {heroVehicle.brand} {heroVehicle.model}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="py-section">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="fade-in max-w-lg">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
                Selección actual
              </p>
              <h2 className="mt-3 text-2xl min-[375px]:text-3xl md:text-4xl">Destacados</h2>
            </div>
            <Button href="/catalogo" variant="ghost" className="fade-in fade-in-delay-1 self-start md:self-auto">
              Ver todos →
            </Button>
          </div>

          <div className="mt-10 grid gap-6 min-[425px]:grid-cols-2 min-[425px]:gap-8 lg:grid-cols-3">
            {featured.map((vehicle, index) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
            ))}
          </div>
        </Container>
      </section>

      <HomeLocationSection />

      <section id="contacto" className="border-t border-border bg-surface py-section">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div className="fade-in">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
                Contacto directo
              </p>
              <h2 className="mt-3 text-2xl min-[375px]:text-3xl md:text-4xl">
                Solicita una cotización
              </h2>
              <p className="mt-4 text-muted">
                Completa el formulario y te contactamos con información clara,
                sin presión comercial. También puedes escribirnos directamente.
              </p>
              <div className="action-stack mt-6 min-[375px]:mt-8">
                <Button
                  href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                  variant="outline"
                  className="action-btn"
                >
                  WhatsApp · {siteConfig.contact.whatsappDisplay}
                </Button>
                <Button
                  href={`mailto:${siteConfig.contact.email}`}
                  variant="ghost"
                  className="action-btn"
                >
                  {siteConfig.contact.email}
                </Button>
              </div>
            </div>

            <div className="fade-in fade-in-delay-1 rounded-md border border-border bg-background p-4 min-[375px]:p-6 md:p-8">
              <QuoteForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
