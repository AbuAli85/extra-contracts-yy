"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow } from "date-fns"
import { useTranslations } from "next-intl"
import type { Notification } from "@/lib/dashboard-types"

interface NotificationSystemProps {
  notifications: Notification[]
}

export function NotificationSystem({ notifications: initialNotifications }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const t = useTranslations("DashboardNotificationSystem")

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    // In a real app, you'd update the backend here
    console.log(`Notification ${id} marked as read`)
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    // In a real app, you'd update the backend here
    console.log("All notifications marked as read")
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("yourNotifications")}</CardTitle>
        {unreadNotificationsCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            {t("markAllAsRead")}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p className="text-center text-muted-foreground">{t("noNotifications")}</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div key={notification.id} className="flex items-start space-x-4">
                <div
                  className={`flex-shrink-0 h-3 w-3 rounded-full ${notification.isRead ? "bg-muted-foreground" : "bg-primary"}`}
                />
                <div className="flex-grow">
                  <p className={`font-medium ${notification.isRead ? "text-muted-foreground" : ""}`}>
                    {notification.message}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                  </p>
                  {!notification.isRead && (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 mt-1 text-xs"
                      onClick={() => markAsRead(notification.id)}
                    >
                      {t("markAsRead")}
                    </Button>
                  )}
                </div>
                {index < notifications.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
