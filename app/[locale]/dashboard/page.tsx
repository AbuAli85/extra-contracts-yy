<<<<<<< HEAD
import { redirect } from 'next/navigation'

export default async function LocaleDashboardPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params
  
  // Redirect to the main dashboard since we have a unified dashboard
  redirect('/dashboard')
=======
import DashboardContent from "@/components/dashboard/dashboard-content"

export default async function LocaleDashboardPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params
  
  return <DashboardContent locale={locale} />
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
} 