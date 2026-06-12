'use client';

import { getCompareUrl, MAX_COMPARE, useCompare } from '@/components/compare/compare-context';
import { Button } from '@/components/ui/button';

export function CompareBar() {
  const { slugs, clear } = useCompare();

  if (slugs.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md fade-in">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-6 py-4 md:px-12">
        <p className="text-sm text-foreground">
          <span className="font-medium">{slugs.length}</span>
          <span className="text-muted">
            {' '}
            de {MAX_COMPARE} seleccionados para comparar
          </span>
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={clear}>
            Limpiar
          </Button>
          <Button href={getCompareUrl(slugs)} size="sm">
            Comparar
          </Button>
        </div>
      </div>
    </div>
  );
}
