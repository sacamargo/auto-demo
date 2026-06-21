'use client';

import { Toaster } from 'sileo';
import 'sileo/styles.css';
import { adminSileoDefaults } from '@/config/sileo-theme';

type AdminSileoProviderProps = {
  children: React.ReactNode;
};

export function AdminSileoProvider({ children }: AdminSileoProviderProps) {
  return (
    <>
      <Toaster
        position="top-right"
        options={adminSileoDefaults}
        offset={{ top: 16, right: 16 }}
      />
      {children}
    </>
  );
}
