import { redirect } from 'next/navigation'

export default async function LocaleNotificationsPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params
  
  // Redirect to the main dashboard notifications page
  redirect('/dashboard/notifications')
} 