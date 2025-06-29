import { getTranslations } from "next-intl/server"

import { getNotifications } from "@/lib/dashboard-data"
import { NotificationSystem } from "@/components/dashboard/notification-system"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function NotificationsPage() {
  const t = await getTranslations("DashboardNotificationsPage")
  const { data: notifications, error } = await getNotifications()

  if (error) {
    console.error("Error fetching notifications:", error)
    return <div className="text-red-500">{t("errorLoadingNotifications")}</div>
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">{t("notifications")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("yourNotifications")}</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationSystem notifications={notifications || []} />
        </CardContent>
      </Card>
    </div>
  )
}
