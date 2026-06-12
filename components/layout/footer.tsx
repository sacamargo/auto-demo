import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Container } from '@/components/layout/container';
import { Logo } from '@/components/layout/logo';

const footerLinks = {
  navegacion: [
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/comparar', label: 'Comparar' },
    { href: '/#contacto', label: 'Contacto' },
  ],
  legal: [
    { href: '/politica-de-privacidad', label: 'Política de privacidad' },
    { href: '/terminos-y-condiciones', label: 'Términos y condiciones' },
  ],
};

export function Footer() {
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}`;

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-section">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-sm text-sm text-muted">
              Selección curada de vehículos premium. Cada unidad revisada con
              criterio editorial, no volumen.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
              Navegación
            </p>
            <ul className="mt-4 space-y-3">
              {footerLinks.navegacion.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground transition-colors duration-200 ease-out hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
              Contacto
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground transition-colors duration-200 ease-out hover:text-accent"
                >
                  {siteConfig.contact.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-foreground transition-colors duration-200 ease-out hover:text-accent"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-200 ease-out hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
