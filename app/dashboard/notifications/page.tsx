import { getTranslations } from "next-intl/server"
import { NotificationSystem } from "@/components/dashboard/notification-system"
import { getNotifications } from "@/lib/dashboard-data"

export default async function NotificationsPage() {
  const t = await getTranslations("DashboardNotifications")
  const initialNotifications = await getNotifications()

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <h1 className="text-2xl font-semibold">{t("notificationsTitle")}</h1>
      <NotificationSystem notifications={initialNotifications} />
    </main>
  )
}
