import type { FuelType, LeadStatus, TransmissionType, VehicleStatus } from '@/types/database';

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

const leadStatusLabels: Record<LeadStatus, string> = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  cerrado: 'Cerrado',
  descartado: 'Descartado',
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

export function getLeadStatusLabel(status: LeadStatus) {
  return leadStatusLabels[status];
}
