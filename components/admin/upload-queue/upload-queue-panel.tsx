'use client';

import { cn } from '@/lib/utils';
import { SILEO_UI, sileoPanelClasses } from '@/config/sileo-theme';
import {
  getPhaseLabel,
  useUploadQueue,
} from '@/components/admin/upload-queue/upload-queue-context';

export function UploadQueuePanel() {
  const { jobs, minimized, setMinimized, hasActiveJobs } = useUploadQueue();

  if (!hasActiveJobs) return null;

  const activeJob = jobs.find((job) => job.status === 'processing');
  const queuedCount = jobs.filter((job) => job.status === 'queued').length;

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2"
      aria-live="polite"
    >
      <div
        className={cn(
          sileoPanelClasses.shell,
          'pointer-events-auto w-[min(100vw-2rem,22rem)]'
        )}
        style={{
          borderRadius: SILEO_UI.roundness,
          boxShadow: SILEO_UI.shadow,
        }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#eaeaea] px-4 py-3">
          <div className="flex items-center gap-3">
            <span className={sileoPanelClasses.badge}>↑</span>
            <div>
              <p className={sileoPanelClasses.title}>Cola de subidas</p>
              <p className={sileoPanelClasses.description}>
                {activeJob
                  ? `${activeJob.vehicleLabel} · Foto ${activeJob.currentFileIndex + 1} de ${activeJob.files.length}`
                  : `${queuedCount} en espera`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMinimized(!minimized)}
            className="rounded-full px-2 py-1 text-xs text-[#787774] transition-colors hover:bg-[#0a0a0a]/5"
            aria-expanded={!minimized}
          >
            {minimized ? 'Abrir' : 'Minimizar'}
          </button>
        </div>

        {!minimized && (
          <div className="space-y-3 px-4 py-3">
            {jobs.map((job) => {
              const isActive = job.status === 'processing';
              const isQueued = job.status === 'queued';
              const isError = job.status === 'error';

              return (
                <div key={job.id} className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={sileoPanelClasses.title}>{job.vehicleLabel}</p>
                      <p className={sileoPanelClasses.description}>
                        {isError
                          ? job.error ?? 'Error al subir'
                          : isQueued
                            ? `${job.files.length} foto${job.files.length === 1 ? '' : 's'} · En espera`
                            : `${getPhaseLabel(job.phase)} · Foto ${job.currentFileIndex + 1} de ${job.files.length}`}
                      </p>
                    </div>
                    {isActive && (
                      <span className="font-mono text-xs text-[#787774]">
                        {job.progress}%
                      </span>
                    )}
                  </div>

                  {(isActive || isError) && (
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#0a0a0a]/5">
                      <div
                        className={cn(
                          'h-full rounded-full transition-[width] duration-300 ease-out',
                          isError ? 'bg-[#9f2f2d]' : 'bg-[#346538]'
                        )}
                        style={{ width: `${isError ? 100 : job.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
