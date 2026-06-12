'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'autodemo-compare';
export const MAX_COMPARE = 3;

type CompareContextValue = {
  slugs: string[];
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  isSelected: (slug: string) => boolean;
  isFull: boolean;
};

const CompareContext = createContext<CompareContextValue | null>(null);

function readStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_COMPARE) : [];
  } catch {
    return [];
  }
}

function writeStorage(slugs: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(readStorage());
  }, []);

  const toggle = useCallback((slug: string) => {
    setSlugs((current) => {
      let next: string[];
      if (current.includes(slug)) {
        next = current.filter((s) => s !== slug);
      } else if (current.length >= MAX_COMPARE) {
        return current;
      } else {
        next = [...current, slug];
      }
      writeStorage(next);
      return next;
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setSlugs((current) => {
      const next = current.filter((s) => s !== slug);
      writeStorage(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSlugs([]);
    writeStorage([]);
  }, []);

  const value = useMemo(
    () => ({
      slugs,
      toggle,
      remove,
      clear,
      isSelected: (slug: string) => slugs.includes(slug),
      isFull: slugs.length >= MAX_COMPARE,
    }),
    [slugs, toggle, remove, clear]
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
}

export function getCompareUrl(slugs: string[]) {
  if (slugs.length === 0) return '/comparar';
  return `/comparar?ids=${slugs.join(',')}`;
}
