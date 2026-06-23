import { financingContent } from '@/config/site-content';
import { FadeIn } from '@/components/motion/fade-in';

export function FinancingBenefits() {
  return (
    <section className="mt-section">
      <FadeIn>
        <h2 className="font-serif text-2xl min-[375px]:text-3xl">¿Por qué financiar con nosotros?</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Proceso claro, sin sorpresas en el camino. Te acompañamos desde la simulación
          hasta la entrega del vehículo.
        </p>
      </FadeIn>

      <ul className="mt-8 grid gap-4 min-[425px]:mt-10 min-[425px]:grid-cols-2 min-[425px]:gap-6">
        {financingContent.benefits.map((benefit, index) => (
          <FadeIn
            key={benefit.title}
            delay={(index % 4) as 0 | 1 | 2 | 3}
            className="card-hover rounded-md border border-border bg-surface p-4 min-[375px]:p-6"
          >
            <h3 className="font-serif text-xl">{benefit.title}</h3>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              {benefit.description}
            </p>
          </FadeIn>
        ))}
      </ul>
    </section>
  );
}

export function FinancingSteps() {
  return (
    <section className="mt-section border-t border-border pt-section">
      <FadeIn>
        <h2 className="font-serif text-2xl min-[375px]:text-3xl">Cómo funciona</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Cuatro pasos, un solo equipo de contacto.
        </p>
      </FadeIn>

      <ol className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {financingContent.steps.map((step, index) => (
          <li
            key={step.step}
            className={`fade-in ${index > 0 ? `fade-in-delay-${Math.min(index, 3)}` : ''}`}
          >
            <span className="font-mono text-sm text-accent">{step.step}</span>
            <h3 className="mt-2 font-serif text-xl">{step.title}</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function FinancingDocuments() {
  return (
    <section className="mt-section border-t border-border pt-section">
      <FadeIn>
        <h2 className="font-serif text-2xl min-[375px]:text-3xl">Documentos habituales</h2>
        <p className="mt-3 max-w-2xl text-muted">
          La lista exacta puede variar según entidad financiera y tipo de vinculación
          laboral.
        </p>
        <ul className="mt-6 space-y-2">
          {financingContent.documents.map((doc) => (
            <li key={doc} className="flex gap-3 text-sm text-muted">
              <span className="text-accent" aria-hidden>
                —
              </span>
              {doc}
            </li>
          ))}
        </ul>
      </FadeIn>
    </section>
  );
}

export function FinancingPartners() {
  return (
    <FadeIn className="mt-10 rounded-md border border-dashed border-border bg-background p-6">
      <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
        Aliados financieros
      </p>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground">
        {financingContent.partners.map((partner) => (
          <li key={partner}>{partner}</li>
        ))}
      </ul>
    </FadeIn>
  );
}
