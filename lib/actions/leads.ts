'use server';

import { revalidatePath } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/auth/admin';
import { sanitizeText } from '@/lib/sanitize';
import { createAdminClient } from '@/lib/supabase/admin';
import type { LeadStatus } from '@/types/database';

type ActionResult = {
  success: boolean;
  error?: string;
};

const LEAD_STATUSES: LeadStatus[] = [
  'nuevo',
  'contactado',
  'cerrado',
  'descartado',
];

function getAdminDb(): SupabaseClient {
  return createAdminClient() as SupabaseClient;
}

export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus
): Promise<ActionResult> {
  await requireAdmin();

  if (!LEAD_STATUSES.includes(status)) {
    return { success: false, error: 'Estado inválido' };
  }

  const supabase = getAdminDb();
  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', leadId);

  if (error) {
    return { success: false, error: 'No se pudo actualizar el estado' };
  }

  revalidatePath('/admin/leads');
  return { success: true };
}

export async function updateLeadNotes(
  leadId: string,
  notes: string
): Promise<ActionResult> {
  await requireAdmin();

  const supabase = getAdminDb();
  const { error } = await supabase
    .from('leads')
    .update({ admin_notes: sanitizeText(notes) })
    .eq('id', leadId);

  if (error) {
    return { success: false, error: 'No se pudieron guardar las notas' };
  }

  revalidatePath('/admin/leads');
  return { success: true };
}
