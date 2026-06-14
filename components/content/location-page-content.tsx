import {
  getGoogleMapsUrl,
  getMapEmbedUrl,
  getWazeUrl,
  locationContent,
} from '@/config/site-content';
import { siteConfig } from '@/config/site';
import { ContentPageHero } from '@/components/content/content-page-hero';
import { FadeIn } from '@/components/motion/fade-in';
import { Button } from '@/components/ui/button';

export function LocationPageContent() {
  const { lat, lng } = locationContent.coordinates;
  const { fullAddress } = locationContent;
  const googleUrl = getGoogleMapsUrl(fullAddress);
  const wazeUrl = getWazeUrl(lat, lng);
  const mapEmbedUrl = getMapEmbedUrl(fullAddress);
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent('Hola, quiero agendar una visita al showroom en Riomar, Barranquilla.')}`;

  return (
    <>
      <ContentPageHero {...locationContent.hero} />

      <div className="mt-section grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <FadeIn className="space-y-8">
          <div className="rounded-md border border-border bg-surface p-6">
            <h2 className="font-serif text-2xl">{locationContent.name}</h2>
            <address className="mt-4 not-italic text-muted leading-relaxed">
              {locationContent.fullAddress}
            </address>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={googleUrl} variant="outline" size="sm">
                Google Maps
              </Button>
              <Button href={wazeUrl} variant="outline" size="sm">
                Waze
              </Button>
              <Button href={whatsappUrl} size="sm">
                Agendar visita
              </Button>
            </div>
          </div>

          <div className="rounded-md border border-border bg-surface p-6">
            <h3 className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
              Horarios
            </h3>
            <ul className="mt-4 space-y-3">
              {locationContent.hours.map((row) => (
                <li
                  key={row.days}
                  className="flex flex-col gap-0.5 border-b border-border pb-3 last:border-0 last:pb-0 sm:flex-row sm:justify-between"
                >
                  <span className="text-sm text-foreground">{row.days}</span>
                  <span className="text-sm text-muted">{row.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted">{locationContent.parking}</p>
          </div>
        </FadeIn>

        <FadeIn delay={1}>
          <div className="overflow-hidden rounded-md border border-border bg-surface">
            <iframe
              title={`Mapa — ${locationContent.name}`}
              src={mapEmbedUrl}
              className="aspect-[4/3] w-full border-0 lg:aspect-square"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </FadeIn>
      </div>
    </>
  );
}
