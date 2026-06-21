'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { sileo } from 'sileo';
import { UPLOAD_TOAST } from '@/config/sileo-theme';
import {
  finalizeUploadJob,
  processUploadJobFile,
} from '@/components/admin/upload-queue/process-upload-job';
import type {
  EnqueueUploadInput,
  UploadJob,
  UploadJobPhase,
} from '@/components/admin/upload-queue/types';

type UploadQueueContextValue = {
  jobs: UploadJob[];
  enqueueUpload: (input: EnqueueUploadInput) => string;
  hasActiveJobs: boolean;
  minimized: boolean;
  setMinimized: (value: boolean) => void;
};

const UploadQueueContext = createContext<UploadQueueContextValue | null>(null);

function createJob(input: EnqueueUploadInput): UploadJob {
  return {
    id: crypto.randomUUID(),
    vehicleId: input.vehicleId,
    vehicleLabel: input.vehicleLabel,
    files: input.files,
    startSortOrder: input.startSortOrder,
    status: 'queued',
    phase: 'queued',
    progress: 0,
    currentFileIndex: 0,
    createdAt: Date.now(),
  };
}

export function UploadQueueProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const [minimized, setMinimized] = useState(false);
  const processingRef = useRef(false);
  const jobsRef = useRef(jobs);

  jobsRef.current = jobs;

  const updateJob = useCallback((jobId: string, patch: Partial<UploadJob>) => {
    setJobs((current) =>
      current.map((job) => (job.id === jobId ? { ...job, ...patch } : job))
    );
  }, []);

  const runProcessor = useCallback(async () => {
    if (processingRef.current) return;

    const nextJob = jobsRef.current.find((job) => job.status === 'queued');
    if (!nextJob) return;

    processingRef.current = true;

    updateJob(nextJob.id, {
      status: 'processing',
      phase: 'optimizing',
      progress: 0,
      currentFileIndex: 0,
      error: undefined,
    });

    try {
      for (let fileIndex = 0; fileIndex < nextJob.files.length; fileIndex++) {
        updateJob(nextJob.id, {
          phase: 'optimizing',
          currentFileIndex: fileIndex,
        });

        await processUploadJobFile(nextJob, fileIndex, (fileProgress) => {
          const overall =
            ((fileIndex + fileProgress / 100) / nextJob.files.length) * 100;
          updateJob(nextJob.id, {
            progress: Math.min(99, Math.round(overall)),
            phase:
              fileProgress < 45
                ? 'optimizing'
                : fileProgress < 80
                  ? 'uploading'
                  : 'registering',
          });
        });
      }

      await finalizeUploadJob(nextJob.vehicleId);

      updateJob(nextJob.id, {
        status: 'completed',
        phase: 'queued',
        progress: 100,
        currentFileIndex: Math.max(0, nextJob.files.length - 1),
      });

      sileo.success({
        title: UPLOAD_TOAST.publishedTitle,
        description: `${nextJob.vehicleLabel} · ${nextJob.files.length} foto${nextJob.files.length === 1 ? '' : 's'}`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al subir fotos';

      updateJob(nextJob.id, {
        status: 'error',
        error: message,
      });

      sileo.error({
        title: 'No se pudieron subir todas las fotos',
        description: `${nextJob.vehicleLabel} · ${message}`,
      });
    } finally {
      processingRef.current = false;
    }
  }, [updateJob]);

  useEffect(() => {
    const hasQueued = jobs.some((job) => job.status === 'queued');
    const isProcessing = jobs.some((job) => job.status === 'processing');

    if (hasQueued && !isProcessing && !processingRef.current) {
      void runProcessor();
    }
  }, [jobs, runProcessor]);

  useEffect(() => {
    if (processingRef.current) return undefined;

    const hasPending = jobs.some(
      (job) => job.status === 'queued' || job.status === 'processing'
    );
    if (hasPending) return undefined;

    const completed = jobs.filter((job) => job.status === 'completed');
    if (completed.length === 0) return undefined;

    const timer = window.setTimeout(() => {
      setJobs((current) => current.filter((job) => job.status !== 'completed'));
    }, 8000);

    return () => window.clearTimeout(timer);
  }, [jobs]);

  const enqueueUpload = useCallback((input: EnqueueUploadInput) => {
    const job = createJob(input);

    setJobs((current) => {
      const next = [...current, job];
      const position = next.filter(
        (item) =>
          item.id === job.id ||
          item.status === 'queued' ||
          item.status === 'processing'
      ).length;

      sileo.info({
        title: 'Guardado',
        description:
          position > 1
            ? `${input.vehicleLabel} · Fotos en cola (posición ${position})`
            : `${input.vehicleLabel} · Subiendo fotos…`,
      });

      return next;
    });

    setMinimized(false);
    return job.id;
  }, []);

  const hasActiveJobs = useMemo(
    () =>
      jobs.some(
        (job) =>
          job.status === 'queued' ||
          job.status === 'processing' ||
          job.status === 'error'
      ),
    [jobs]
  );

  useEffect(() => {
    if (!hasActiveJobs) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasActiveJobs]);

  const value = useMemo(
    () => ({
      jobs,
      enqueueUpload,
      hasActiveJobs,
      minimized,
      setMinimized,
    }),
    [jobs, enqueueUpload, hasActiveJobs, minimized]
  );

  return (
    <UploadQueueContext.Provider value={value}>
      {children}
    </UploadQueueContext.Provider>
  );
}

export function useUploadQueue() {
  const context = useContext(UploadQueueContext);
  if (!context) {
    throw new Error('useUploadQueue debe usarse dentro de UploadQueueProvider');
  }
  return context;
}

export function getPhaseLabel(phase: UploadJobPhase): string {
  switch (phase) {
    case 'queued':
      return 'En espera';
    case 'optimizing':
      return 'Optimizando…';
    case 'uploading':
      return 'Subiendo…';
    case 'registering':
      return 'Registrando…';
    default:
      return '';
  }
}
