import { redirect } from 'next/navigation'

export default async function LocaleUsersPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params
  
  // Redirect to the main dashboard users page
  redirect('/dashboard/users')
} 