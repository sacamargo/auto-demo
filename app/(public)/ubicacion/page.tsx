import type { Metadata } from 'next';
import { locationContent } from '@/config/site-content';
import { LocationPageContent } from '@/components/content/location-page-content';
import { Container } from '@/components/layout/container';

export const metadata: Metadata = {
  title: 'Ubicación',
  description: locationContent.hero.description,
};

export default function UbicacionPage() {
  return (
    <Container className="py-section">
      <LocationPageContent />
    </Container>
  );
}
