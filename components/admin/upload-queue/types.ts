export type UploadJobPhase = 'queued' | 'optimizing' | 'uploading' | 'registering';

export type UploadJobStatus = 'queued' | 'processing' | 'completed' | 'error';

export type UploadJob = {
  id: string;
  vehicleId: string;
  vehicleLabel: string;
  files: File[];
  startSortOrder: number;
  status: UploadJobStatus;
  phase: UploadJobPhase;
  progress: number;
  currentFileIndex: number;
  error?: string;
  createdAt: number;
};

export type EnqueueUploadInput = {
  vehicleId: string;
  vehicleLabel: string;
  files: File[];
  startSortOrder: number;
};
