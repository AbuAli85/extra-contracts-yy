"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NotificationSystem } from "@/components/dashboard/notification-system"
import { useQuery } from "@tanstack/react-query"
import { getNotifications } from "@/lib/dashboard-data.client"
import { Loader2 } from "lucide-react"

export default function DashboardNotificationsPage() {
  const t = useTranslations("DashboardNotificationsPage")

  const {
    data: notificationsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">{t("loadingNotifications")}</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-red-500">
        {t("errorLoading")}: {error?.message || t("unknownError")}
      </div>
    )
  }

  if (!notificationsData?.success || !notificationsData.data) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-red-500">
        {t("errorFetchingData")}: {notificationsData?.message || t("unknownError")}
      </div>
    )
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationSystem notifications={notificationsData.data} />
        </CardContent>
      </Card>
    </div>
  )
}
