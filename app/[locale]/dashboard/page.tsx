import { redirect } from 'next/navigation'

export default async function LocaleDashboardPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params
  
  // Redirect to the main dashboard since we have a unified dashboard
  redirect('/dashboard')
} 