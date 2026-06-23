'use client';

import { useCompare } from '@/components/compare/compare-context';
import { cn } from '@/lib/utils';

type CompareToggleProps = {
  slug: string;
  className?: string;
};

export function CompareToggle({ slug, className }: CompareToggleProps) {
  const { toggle, isSelected, isFull } = useCompare();
  const selected = isSelected(slug);
  const disabled = !selected && isFull;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) toggle(slug);
      }}
      disabled={disabled}
      className={cn(
        'pressable text-xs font-medium uppercase tracking-[0.05em] transition-colors duration-200 ease-out',
        selected
          ? 'text-accent'
          : disabled
            ? 'cursor-not-allowed text-muted/50'
            : 'text-foreground/70 hover:text-foreground',
        className
      )}
      aria-pressed={selected}
      aria-label={selected ? 'Quitar de comparación' : 'Agregar a comparación'}
    >
      {selected ? 'En comparación' : 'Comparar'}
    </button>
  );
}
