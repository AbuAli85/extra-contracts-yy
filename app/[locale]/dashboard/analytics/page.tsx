import AnalyticsPage from '../../../dashboard/analytics/page'

export default async function LocaleAnalyticsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <AnalyticsPage locale={locale} />
} 