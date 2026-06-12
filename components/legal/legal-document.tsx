import { Container } from '@/components/layout/container';

type LegalDocumentProps = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: React.ReactNode;
};

export function LegalDocument({
  title,
  subtitle,
  lastUpdated,
  children,
}: LegalDocumentProps) {
  return (
    <Container narrow className="py-section">
      <header className="fade-in border-b border-border pb-10">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
          {subtitle}
        </p>
        <h1 className="mt-3 text-4xl md:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-muted">Última actualización: {lastUpdated}</p>
      </header>

      <article className="legal-prose fade-in fade-in-delay-1 mt-10 space-y-8">
        {children}
      </article>
    </Container>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="font-serif text-2xl text-foreground">{title}</h2>
      <div className="space-y-3 text-muted leading-relaxed">{children}</div>
    </section>
  );
}

export function LegalPlaceholder({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-accent/40 bg-[var(--status-reserved-bg)] p-4 text-sm text-[var(--status-reserved-text)]">
      <p className="text-xs font-medium uppercase tracking-[0.05em]">
        Completar antes de producción
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
