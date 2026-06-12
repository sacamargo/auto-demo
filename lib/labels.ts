import type { FuelType, TransmissionType, VehicleStatus } from '@/types/database';

const fuelLabels: Record<FuelType, string> = {
  gasolina: 'Gasolina',
  diesel: 'Diésel',
  hibrido: 'Híbrido',
  electrico: 'Eléctrico',
  gas: 'Gas',
};

const transmissionLabels: Record<TransmissionType, string> = {
  manual: 'Manual',
  automatica: 'Automática',
  cvt: 'CVT',
};

const statusLabels: Record<VehicleStatus, string> = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  vendido: 'Vendido',
};

export function getFuelLabel(fuel: FuelType) {
  return fuelLabels[fuel];
}

export function getTransmissionLabel(transmission: TransmissionType) {
  return transmissionLabels[transmission];
}

export function getStatusLabel(status: VehicleStatus) {
  return statusLabels[status];
}
