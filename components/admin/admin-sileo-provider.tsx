'use client';

import { Toaster } from 'sileo';
import 'sileo/styles.css';
import { adminSileoDefaults } from '@/config/sileo-theme';
import { UploadQueuePanel } from '@/components/admin/upload-queue/upload-queue-panel';
import { UploadQueueProvider } from '@/components/admin/upload-queue/upload-queue-context';

type AdminSileoProviderProps = {
  children: React.ReactNode;
};

export function AdminSileoProvider({ children }: AdminSileoProviderProps) {
  return (
    <UploadQueueProvider>
      <Toaster
        position="top-right"
        options={adminSileoDefaults}
        offset={{ top: 16, right: 16 }}
      />
      {children}
      <UploadQueuePanel />
    </UploadQueueProvider>
  );
}
