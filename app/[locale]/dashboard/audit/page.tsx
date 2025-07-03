import { redirect } from 'next/navigation';

export default function LocaleAuditPage({ params }: { params: { locale: string } }) {
  redirect('/dashboard/audit');
}