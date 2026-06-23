import type { SileoOptions } from 'sileo';

/** Tokens compartidos entre toasts Sileo y el panel de cola del admin. */
export const SILEO_UI = {
  fill: '#FFFFFF',
  roundness: 16,
  shadow: '0 8px 32px rgba(10, 10, 10, 0.08)',
  border: '1px solid #eaeaea',
} as const;

export const adminSileoDefaults: Partial<SileoOptions> = {
  fill: SILEO_UI.fill,
  roundness: SILEO_UI.roundness,
  duration: 6000,
};

/** Clases Tailwind alineadas al look de Sileo (panel de cola, tarjetas auxiliares). */
export const sileoPanelClasses = {
  shell:
    'overflow-hidden border border-[#eaeaea] bg-white text-[#0a0a0a] shadow-[0_8px_32px_rgba(10,10,10,0.08)]',
  title: 'text-sm font-medium leading-snug text-[#0a0a0a]',
  description: 'text-xs leading-relaxed text-[#787774]',
  badge:
    'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0a0a0a]/5 text-[10px] font-medium uppercase tracking-wide text-[#787774]',
} as const;

export const UPLOAD_TOAST = {
  publishedTitle: 'Vehículo publicado',
} as const;
