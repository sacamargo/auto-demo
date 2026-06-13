import 'server-only';

import { getAllLeadsAdmin } from '@/lib/admin/leads';
import { getAllVehiclesAdmin } from '@/lib/admin/vehicles';
import type { LeadWithVehicle } from '@/types/database';

export type DashboardStats = {
  leadsThisWeek: number;
  nuevosCount: number;
  totalLeads: number;
  disponibles: number;
  reservados: number;
  totalVehicles: number;
  recentLeads: LeadWithVehicle[];
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const [leads, vehicles] = await Promise.all([
    getAllLeadsAdmin(),
    getAllVehiclesAdmin(),
  ]);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const leadsThisWeek = leads.filter(
    (lead) => new Date(lead.created_at) >= weekAgo
  ).length;

  const nuevos = leads.filter((lead) => lead.status === 'nuevo');

  return {
    leadsThisWeek,
    nuevosCount: nuevos.length,
    totalLeads: leads.length,
    disponibles: vehicles.filter((v) => v.status === 'disponible').length,
    reservados: vehicles.filter((v) => v.status === 'reservado').length,
    totalVehicles: vehicles.length,
    recentLeads: nuevos.slice(0, 5),
  };
}
