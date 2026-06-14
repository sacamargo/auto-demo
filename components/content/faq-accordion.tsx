'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/motion/fade-in';

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
  className?: string;
};

export function FaqAccordion({ items, className }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={cn('divide-y divide-border rounded-md border border-border bg-surface', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <FadeIn key={item.question} delay={(index % 4) as 0 | 1 | 2 | 3}>
            <div>
              <button
                type="button"
                className="flex w-full items-start justify-between gap-4 p-5 text-left transition-colors duration-200 ease-out hover:bg-background/60"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="font-medium text-foreground">{item.question}</span>
                <span
                  className={cn(
                    'mt-0.5 shrink-0 text-muted transition-transform duration-200 ease-out',
                    isOpen && 'rotate-45'
                  )}
                  aria-hidden
                >
                  +
                </span>
              </button>
              <div
                className={cn(
                  'grid transition-[grid-template-rows] duration-300 ease-out',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-muted leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}
