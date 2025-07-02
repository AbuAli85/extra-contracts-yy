import { redirect } from 'next/navigation'

export default async function LocaleSettingsPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params
  
  // Redirect to the main dashboard settings page
  redirect('/dashboard/settings')
} 