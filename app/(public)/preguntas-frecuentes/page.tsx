import type { Metadata } from 'next';
import Link from 'next/link';
import { faqContent } from '@/config/site-content';
import { ContentPageHero } from '@/components/content/content-page-hero';
import { FaqAccordion } from '@/components/content/faq-accordion';
import { FadeIn } from '@/components/motion/fade-in';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';

export const metadata: Metadata = {
  title: 'Preguntas frecuentes',
  description: faqContent.hero.description,
};

export default function FaqPage() {
  return (
    <Container className="py-section">
      <ContentPageHero {...faqContent.hero} />

      <div className="mt-section space-y-section">
        {faqContent.categories.map((category, index) => (
          <section key={category.id} id={category.id}>
            <FadeIn delay={(index % 4) as 0 | 1 | 2 | 3}>
              <h2 className="font-serif text-2xl md:text-3xl">{category.title}</h2>
            </FadeIn>
            <div className="mt-6">
              <FaqAccordion items={[...category.items]} />
            </div>
          </section>
        ))}
      </div>

      <FadeIn className="mt-section border-t border-border pt-section">
        <div className="rounded-md border border-border bg-surface p-8 text-center md:p-12">
          <h2 className="font-serif text-2xl">¿Aún tienes dudas?</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted">
            Escríbenos por WhatsApp o revisa opciones de{' '}
            <Link
              href="/financiacion"
              className="text-foreground underline underline-offset-2 hover:text-accent"
            >
              financiación
            </Link>{' '}
            y{' '}
            <Link
              href="/ubicacion"
              className="text-foreground underline underline-offset-2 hover:text-accent"
            >
              cómo visitarnos
            </Link>
            .
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href="/#contacto" size="lg">
              Contactar
            </Button>
            <Button href="/catalogo" variant="outline" size="lg">
              Ver catálogo
            </Button>
          </div>
        </div>
      </FadeIn>
    </Container>
  );
}
