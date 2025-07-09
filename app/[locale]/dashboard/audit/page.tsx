<<<<<<< HEAD
import AuditLogsPage from '@/app/dashboard/audit/page';

export default async function LocaleAuditPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <AuditLogsPage />;
=======
import AuditLogsPage from '@/app/dashboard/audit/page';

export default async function LocaleAuditPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <AuditLogsPage />;
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
}