import AuditLogsPage from '@/app/dashboard/audit/page';

export default async function LocaleAuditPage({ params }: { params: { locale: string } }) {
  return <AuditLogsPage />;
}
