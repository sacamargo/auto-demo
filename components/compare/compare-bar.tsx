'use client';

import { getCompareUrl, MAX_COMPARE, useCompare } from '@/components/compare/compare-context';
import { Button } from '@/components/ui/button';

export function CompareBar() {
  const { slugs, clear } = useCompare();

  if (slugs.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md fade-in">
      <div className="mx-auto flex max-w-content flex-col gap-3 px-gutter py-3 min-[425px]:flex-row min-[425px]:items-center min-[425px]:justify-between min-[425px]:py-4 4k:max-w-content-wide">
        <p className="text-xs text-foreground min-[375px]:text-sm">
          <span className="font-medium">{slugs.length}</span>
          <span className="text-muted">
            {' '}
            de {MAX_COMPARE} seleccionados para comparar
          </span>
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={clear} className="flex-1 min-[425px]:flex-none">
            Limpiar
          </Button>
          <Button href={getCompareUrl(slugs)} size="sm" className="flex-1 min-[425px]:flex-none">
            Comparar
          </Button>
        </div>
      </div>
    </div>
  );
}
