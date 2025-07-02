import { redirect } from 'next/navigation'

export default async function LocaleAuditPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params
  
  // Redirect to the main dashboard audit page
  redirect('/dashboard/audit')
} 