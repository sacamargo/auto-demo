import Link from 'next/link';
import type { Vehicle } from '@/types/database';
import { siteConfig } from '@/config/site';
import { financingContent } from '@/config/site-content';
import {
  FinancingBenefits,
  FinancingDocuments,
  FinancingPartners,
  FinancingSteps,
} from '@/components/content/financing-sections';
import { FinancingCalculator } from '@/components/content/financing-calculator';
import { ContentPageHero } from '@/components/content/content-page-hero';
import { QuoteForm } from '@/components/forms/quote-form';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/motion/fade-in';
import { formatPriceCop } from '@/lib/vehicles';
import { resolveImageUrl } from '@/lib/vehicles';

type FinancingPageContentProps = {
  vehicle?: Vehicle;
  backHref?: string;
  backLabel?: string;
};

export function FinancingPageContent({
  vehicle,
  backHref,
  backLabel,
}: FinancingPageContentProps) {
  const isVehiclePage = Boolean(vehicle);
  const referencePrice =
    vehicle?.price_cop ?? financingContent.calculator.defaultReferencePrice;
  const vehicleLabel = vehicle
    ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}`
    : undefined;

  const hero = isVehiclePage
    ? {
        eyebrow: 'Financiación',
        title: `Financia tu ${vehicle!.brand} ${vehicle!.model}`,
        description: `Simula la cuota para este ${vehicle!.year} · ${formatPriceCop(vehicle!.price_cop)}. Te acompañamos en el estudio de crédito y la entrega.`,
      }
    : financingContent.hero;

  const whatsappMessage = vehicle
    ? encodeURIComponent(
        `Hola, quiero información de financiación para el ${vehicle.brand} ${vehicle.model} ${vehicle.year} (${formatPriceCop(vehicle.price_cop)}).`
      )
    : encodeURIComponent(
        `Hola, me interesa conocer opciones de financiación en ${siteConfig.name}.`
      );

  const primaryImage = vehicle?.vehicle_images?.[0];

  return (
    <>
      {backHref && (
        <FadeIn className="mb-6">
          <Button href={backHref} variant="ghost" size="sm">
            ← {backLabel ?? 'Volver'}
          </Button>
        </FadeIn>
      )}

      <ContentPageHero {...hero} />

      {vehicle && primaryImage && (
        <FadeIn delay={1} className="mt-10 overflow-hidden rounded-md border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveImageUrl(
              primaryImage.storage_path,
              process.env.NEXT_PUBLIC_SUPABASE_URL
            )}
            alt={vehicleLabel}
            className="aspect-[21/9] w-full object-cover image-hover"
          />
        </FadeIn>
      )}

      <div className="mt-section grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <FinancingCalculator
          vehiclePrice={referencePrice}
          vehicleLabel={vehicleLabel}
          priceEditable={!isVehiclePage}
        />

        <FadeIn delay={2} className="flex flex-col justify-center space-y-6">
          <div>
            <h2 className="font-serif text-2xl">¿Listo para el siguiente paso?</h2>
            <p className="mt-3 text-muted leading-relaxed">
              {isVehiclePage
                ? 'Envía tu solicitud con este vehículo preseleccionado o escríbenos por WhatsApp con tu simulación.'
                : 'Elige un vehículo del catálogo para una simulación exacta, o contáctanos para una orientación general.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${whatsappMessage}`}
              size="lg"
            >
              Consultar financiación
            </Button>
            {!isVehiclePage && (
              <Button href="/catalogo" variant="outline" size="lg">
                Ver catálogo
              </Button>
            )}
            {isVehiclePage && (
              <Button
                href={`/catalogo/${vehicle!.slug}`}
                variant="outline"
                size="lg"
              >
                Ver ficha del vehículo
              </Button>
            )}
          </div>
        </FadeIn>
      </div>

      <FinancingBenefits />
      <FinancingSteps />
      <FinancingDocuments />
      <FinancingPartners />

      <section
        id="solicitud"
        className="mt-section border-t border-border pt-section"
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
              Solicitud
            </p>
            <h2 className="mt-3 font-serif text-3xl">
              {isVehiclePage
                ? 'Solicita estudio de crédito'
                : 'Cuéntanos qué buscas'}
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Completa el formulario y un asesor te contactará con opciones según
              tu perfil. También puedes revisar nuestras{' '}
              <Link
                href="/preguntas-frecuentes"
                className="text-foreground underline underline-offset-2 hover:text-accent"
              >
                preguntas frecuentes
              </Link>
              .
            </p>
          </FadeIn>
          <FadeIn delay={1}>
            <QuoteForm
              vehicleId={vehicle?.id}
              vehicleInterest={
                vehicle
                  ? `Financiación — ${vehicle.brand} ${vehicle.model} ${vehicle.year}`
                  : 'Financiación — consulta general'
              }
            />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
