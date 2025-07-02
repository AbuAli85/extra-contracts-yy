import { redirect } from 'next/navigation'

export default async function LocaleAnalyticsPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params
  
  // Redirect to the main dashboard analytics page
  redirect('/dashboard/analytics')
} 