import { redirect } from 'next/navigation';

export default async function LocaleAuditPage({ params }: { params: Promise<{ locale: string }> }) {
  await params; // If you do not need locale, just await it for type safety
  redirect('/dashboard/audit');
}
