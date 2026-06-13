import { getAllLeadsAdmin } from '@/lib/admin/leads';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { LeadInbox } from '@/components/admin/lead-inbox';
import { Container } from '@/components/layout/container';

export const metadata = {
  title: 'Leads',
};

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  const leads = await getAllLeadsAdmin();
  const nuevos = leads.filter((lead) => lead.status === 'nuevo').length;

  return (
    <Container className="py-10">
      <AdminPageHeader
        title="Leads"
        description={
          nuevos > 0
            ? `${nuevos} solicitud${nuevos === 1 ? '' : 'es'} nueva${nuevos === 1 ? '' : 's'} por revisar`
            : `${leads.length} solicitudes en total`
        }
      />

      <div className="mt-8">
        <LeadInbox leads={leads} />
      </div>
    </Container>
  );
}
