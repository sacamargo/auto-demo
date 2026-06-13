'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4;
};

const delayClass = {
  0: '',
  1: 'fade-in-delay-1',
  2: 'fade-in-delay-2',
  3: 'fade-in-delay-3',
  4: 'fade-in-delay-4',
} as const;

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        visible && 'fade-in',
        visible && delay > 0 && delayClass[delay],
        !visible && 'opacity-0 translate-y-3',
        className
      )}
    >
      {children}
    </div>
  );
}
