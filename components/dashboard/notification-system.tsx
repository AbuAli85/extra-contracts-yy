"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Notification } from "@/lib/dashboard-types"
import { useTranslations } from "next-intl"
import { format } from "date-fns"
import { BellRing, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NotificationSystemProps {
  notifications: Notification[]
}

export function NotificationSystem({ notifications }: NotificationSystemProps) {
  const t = useTranslations("NotificationSystem")

  // For demonstration, we'll just display them. In a real app, you'd have mark as read actions.
  const unreadNotifications = notifications.filter((n) => !n.read)
  const readNotifications = notifications.filter((n) => n.read)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p className="text-muted-foreground">{t("noNotifications")}</p>
        ) : (
          <div className="grid gap-4">
            {unreadNotifications.length > 0 && (
              <>
                <h3 className="text-lg font-semibold">{t("unreadNotifications")}</h3>
                {unreadNotifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3 rounded-md border p-3">
                    <BellRing className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(notification.timestamp), "PPP p")}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      {t("markAsRead")}
                    </Button>
                  </div>
                ))}
              </>
            )}

            {readNotifications.length > 0 && (
              <>
                <h3 className="text-lg font-semibold">{t("readNotifications")}</h3>
                {readNotifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3 rounded-md border p-3 opacity-70">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(notification.timestamp), "PPP p")}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
