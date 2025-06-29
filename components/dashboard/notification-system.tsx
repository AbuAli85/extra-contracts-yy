"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BellIcon, CheckCircleIcon, InfoIcon, XCircleIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { devLog } from "@/lib/dev-log"
import type { NotificationItem, NotificationRow, Notification } from "@/lib/dashboard-types"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { useTranslations } from "next-intl"

interface NotificationSystemProps {
  notifications: Notification[]
}

export function NotificationSystem({ notifications }: NotificationSystemProps) {
  const [localNotifications, setLocalNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const t = useTranslations("DashboardNotifications")

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <InfoIcon className="h-5 w-5 text-blue-500" />
      case "success":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case "warning":
        return <BellIcon className="h-5 w-5 text-yellow-500" />
      case "error":
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          "id, type, message, created_at, user_email, related_contract_id, related_entity_id, related_entity_type, is_read",
        )
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) throw error
      setLocalNotifications(
        data.map((n: NotificationRow) => ({
          id: n.id,
          type: n.type as NotificationItem["type"],
          message: n.message,
          timestamp: n.created_at, // This is already an ISO string
          user_email: n.user_email,
          related_contract_id: n.related_contract_id,
          isRead: n.is_read,
          context: n.related_contract_id
            ? `Contract ID: ${n.related_contract_id}`
            : n.related_entity_id
              ? `${n.related_entity_type || "Entity"} ID: ${n.related_entity_id}`
              : n.user_email
                ? `User: ${n.user_email}`
                : undefined,
        })),
      )
    } catch (error: any) {
      console.error("Error fetching notifications:", error)
      toast({ title: "Error Fetching Notifications", description: error.message, variant: "destructive" })
      setLocalNotifications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const channel = supabase
      .channel("public:notifications:feed") // Unique channel name
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
        const newNotif = payload.new as NotificationRow
        devLog("New notification received:", newNotif)
        toast({ title: "New Notification", description: newNotif.message })
        setLocalNotifications((prev) =>
          [
            {
              id: newNotif.id,
              type: newNotif.type as NotificationItem["type"],
              message: newNotif.message,
              timestamp: newNotif.created_at,
              user_email: newNotif.user_email,
              related_contract_id: newNotif.related_contract_id,
              isRead: newNotif.is_read,
              context: newNotif.related_contract_id
                ? `Contract ID: ${newNotif.related_contract_id}`
                : newNotif.related_entity_id
                  ? `${newNotif.related_entity_type || "Entity"} ID: ${newNotif.related_entity_id}`
                  : newNotif.user_email
                    ? `User: ${newNotif.user_email}`
                    : undefined,
            },
            ...prev,
          ].slice(0, 20),
        )
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {loading && (
            <div className="flex justify-center items-center h-full">
              <BellIcon className="h-8 w-8 animate-spin" />
            </div>
          )}
          {!loading && localNotifications.length === 0 && (
            <p className="text-center text-muted-foreground py-8">{t("noNotifications")}</p>
          )}
          {!loading && localNotifications.length > 0 && (
            <div className="space-y-3">
              {localNotifications.map((notif) => {
                return (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 p-2.5 border rounded-md hover:bg-muted/50 ${!notif.isRead ? "bg-primary/5 dark:bg-primary/10 border-primary/20" : ""}`}
                  >
                    {getIcon(notif.type)}
                    <div>
                      <p className="text-sm">{notif.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                        {notif.context && ` (${notif.context})`}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
        <Button variant="outline" className="w-full mt-4 bg-transparent" disabled>
          {t("viewAll")}
        </Button>
      </CardContent>
    </Card>
  )
}
