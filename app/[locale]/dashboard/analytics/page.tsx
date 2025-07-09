<<<<<<< HEAD
import AnalyticsPage from '../../../dashboard/analytics/page'

export default async function LocaleAnalyticsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <AnalyticsPage locale={locale} />
} 
=======
import AnalyticsPage from "@/app/dashboard/analytics/page"

export default async function LocaleAnalyticsPage({ params }: { params: { locale: string } }) {
  return <AnalyticsPage />
}
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
