import { createAdminClient } from '@/lib/supabase/admin';
import type { LeadStatus, LeadWithVehicle } from '@/types/database';

type LeadRow = LeadWithVehicle & {
  vehicles: LeadWithVehicle['vehicle'];
};

export async function getAllLeadsAdmin(): Promise<LeadWithVehicle[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('leads')
    .select(
      '*, vehicles:vehicle_id ( id, brand, model, year, slug )'
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as LeadRow[]).map(({ vehicles, ...lead }) => ({
    ...lead,
    vehicle: vehicles ?? null,
  }));
}

export async function getLeadStatsAdmin() {
  const leads = await getAllLeadsAdmin();

  return {
    total: leads.length,
    nuevo: leads.filter((lead) => lead.status === 'nuevo').length,
    contactado: leads.filter((lead) => lead.status === 'contactado').length,
    cerrado: leads.filter((lead) => lead.status === 'cerrado').length,
    descartado: leads.filter((lead) => lead.status === 'descartado').length,
  };
}

export type LeadFilter = LeadStatus | 'todos';

export function filterLeads(
  leads: LeadWithVehicle[],
  filter: LeadFilter
): LeadWithVehicle[] {
  if (filter === 'todos') return leads;
  return leads.filter((lead) => lead.status === filter);
}
