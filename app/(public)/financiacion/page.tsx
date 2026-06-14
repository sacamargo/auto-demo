import type { Metadata } from 'next';
import { financingContent } from '@/config/site-content';
import { FinancingPageContent } from '@/components/content/financing-page-content';
import { Container } from '@/components/layout/container';

export const metadata: Metadata = {
  title: 'Financiación',
  description: financingContent.hero.description,
};

export default function FinanciacionPage() {
  return (
    <Container className="py-section">
      <FinancingPageContent />
    </Container>
  );
}
