import Link from 'next/link';
import {
  getGoogleMapsUrl,
  getMapEmbedUrl,
  getWazeUrl,
  locationContent,
} from '@/config/site-content';
import { siteConfig } from '@/config/site';
import { FadeIn } from '@/components/motion/fade-in';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';

export function HomeLocationSection() {
  const { fullAddress, coordinates, hours } = locationContent;
  const googleUrl = getGoogleMapsUrl(fullAddress);
  const wazeUrl = getWazeUrl(coordinates.lat, coordinates.lng);
  const mapEmbedUrl = getMapEmbedUrl(fullAddress);
  const weekdayHours = hours[0]?.time ?? '';
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent('Hola, quiero agendar una visita al showroom en Riomar.')}`;

  return (
    <section className="border-t border-border py-section">
      <Container>
        <div className="grid gap-8 md:gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:items-center laptop-l:gap-20">
          <FadeIn>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
              Showroom
            </p>
            <h2 className="mt-3 text-2xl min-[375px]:text-3xl md:text-4xl">Visítanos en Riomar</h2>
            <p className="mt-4 max-w-md text-muted leading-relaxed">
              Atención personalizada en Barranquilla. Agenda tu visita para conocer
              el vehículo en persona o resolver dudas de financiación.
            </p>

            <address className="mt-6 not-italic">
              <p className="text-sm font-medium text-foreground">{fullAddress}</p>
              {weekdayHours && (
                <p className="mt-2 text-sm text-muted">Lun–vie · {weekdayHours}</p>
              )}
            </address>

            <div className="action-stack mt-6 min-[375px]:mt-8">
              <Button href={whatsappUrl} size="sm" className="action-btn">
                Agendar visita
              </Button>
              <Button href="/ubicacion" variant="outline" size="sm" className="action-btn">
                Horarios y mapa
              </Button>
              <Button href={googleUrl} variant="ghost" size="sm" className="action-btn">
                Google Maps
              </Button>
              <Button href={wazeUrl} variant="ghost" size="sm" className="action-btn">
                Waze
              </Button>
            </div>

            <p className="mt-6 text-xs text-muted">
              <Link
                href="/ubicacion"
                className="text-foreground underline underline-offset-2 transition-colors hover:text-accent"
              >
                Ver ubicación completa
              </Link>
            </p>
          </FadeIn>

          <FadeIn delay={1}>
            <div className="overflow-hidden rounded-md border border-border bg-surface shadow-sm">
              <iframe
                title={`Mapa — ${locationContent.name}`}
                src={mapEmbedUrl}
                className="aspect-[16/10] w-full border-0 sm:aspect-[4/3]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
