"use client"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  BellRing, 
  Trash2, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Filter
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import clsx from "clsx"
import { toast } from "@/hooks/use-toast"

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  default: BellRing,
}

const getIconColor = (type) => {
  if (type === "success") return "text-green-500"
  if (type === "error") return "text-red-500"
  if (type === "warning") return "text-orange-500"
  return "text-blue-500"
}

const NOTIF_TYPES = ["success", "error", "warning", "info"]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [readFilter, setReadFilter] = useState("")
  const [page, setPage] = useState(1)
  const [isUpdating, setIsUpdating] = useState(false)
  const PAGE_SIZE = 10

  // Fetch notifications with error handling
  const fetchNotifications = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          "id, type, message, created_at, user_email, related_contract_id, related_entity_id, related_entity_type, is_read"
        )
        .order("created_at", { ascending: false })
      
      if (error) throw error
      setNotifications(data || [])
    } catch (err) {
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to load notifications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log("NotificationsPage mounted");
    fetchNotifications()
    
    // Real-time subscription for all events
    const channel = supabase
      .channel("public:notifications:feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotifications((prev) => [payload.new, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setNotifications((prev) =>
              prev.map((n) => (n.id === payload.new.id ? payload.new : n))
            )
          } else if (payload.eventType === "DELETE") {
            setNotifications((prev) =>
              prev.filter((n) => n.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, []);

  // Filtering, searching, and pagination
  const filtered = useMemo(() => {
    let filtered = notifications
    if (search) {
      filtered = filtered.filter(
        (n) =>
          n.message.toLowerCase().includes(search.toLowerCase()) ||
          (n.user_email && n.user_email.toLowerCase().includes(search.toLowerCase()))
      )
    }
    if (typeFilter) {
      filtered = filtered.filter((n) => n.type === typeFilter)
    }
    if (readFilter) {
      filtered = filtered.filter((n) =>
        readFilter === "read" ? n.is_read : !n.is_read
      )
    }
    return filtered
  }, [notifications, search, typeFilter, readFilter])

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)), [filtered.length])

  // Optimistic updates for better UX
  const toggleRead = async (notif) => {
    setIsUpdating(true)
    // Optimistically update UI
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notif.id ? { ...n, is_read: !notif.is_read } : n
      )
    )
    
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: !notif.is_read })
        .eq("id", notif.id)
      
      if (error) throw error
      
      toast({
        title: "Success",
        description: `Marked as ${!notif.is_read ? 'read' : 'unread'}`,
      })
    } catch (err) {
      // Revert on error
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notif.id ? { ...n, is_read: notif.is_read } : n
        )
      )
      toast({
        title: "Error",
        description: "Failed to update notification status.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Bulk mark all as read with optimistic update
  const markAllAsRead = async () => {
    setIsUpdating(true)
    const unreadCount = notifications.filter(n => !n.is_read).length
    if (unreadCount === 0) return
    
    // Optimistically update UI
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("is_read", false)
      
      if (error) throw error
      
      toast({
        title: "Success",
        description: `Marked ${unreadCount} notifications as read`,
      })
    } catch (err) {
      // Revert on error
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: false })))
      toast({
        title: "Error",
        description: "Failed to mark notifications as read.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Bulk clear all with confirmation
  const clearAll = async () => {
    if (!confirm("Are you sure you want to delete all notifications? This action cannot be undone.")) {
      return
    }
    
    setIsUpdating(true)
    const count = notifications.length
    
    // Optimistically update UI
    setNotifications([])
    
    try {
      const { error } = await supabase.from("notifications").delete().neq("id", "")
      
      if (error) throw error
      
      toast({
        title: "Success",
        description: `Cleared ${count} notifications`,
      })
    } catch (err) {
      // Revert on error
      setNotifications((prev) => [...prev])
      toast({
        title: "Error",
        description: "Failed to clear notifications.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Reset page on filter/search change
  useEffect(() => {
    setPage(1)
  }, [search, typeFilter, readFilter])

  // Reset page if current page is beyond total pages (only when filters change)
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages)
    }
  }, [filtered.length])

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5" />
              All Notifications / جميع الإشعارات
            </CardTitle>
            <CardDescription>
              View, search, and manage all system notifications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <XCircle className="h-4 w-4" />
                  <span className="font-medium">Error loading notifications:</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Filters and Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search notifications..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-56 pl-10"
                    aria-label="Search notifications"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="border rounded-md px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Filter by type"
                  >
                    <option value="">All Types</option>
                    {NOTIF_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={readFilter}
                    onChange={(e) => setReadFilter(e.target.value)}
                    className="border rounded-md px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Filter by read/unread"
                  >
                    <option value="">All</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={markAllAsRead}
                  disabled={notifications.every((n) => n.is_read) || isUpdating}
                  aria-label="Mark all as read"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>
                <Button
                  variant="destructive"
                  onClick={clearAll}
                  disabled={notifications.length === 0 || isUpdating}
                  aria-label="Clear all notifications"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear all
                </Button>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin mr-2 h-6 w-6" />
                <span>Loading notifications...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <BellRing className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-500 max-w-sm">
                  {search || typeFilter || readFilter 
                    ? "Try adjusting your filters to see more results."
                    : "You're all caught up! New notifications will appear here."
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-hidden border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200" role="table">
                    <thead className="sticky top-0 bg-background z-10">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Message
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-gray-200">
                      {paginated.map((notif) => {
                        const IconComponent = iconMap[notif.type] || iconMap.default
                        return (
                          <tr
                            key={notif.id}
                            className={clsx(
                              "hover:bg-gray-50 transition-colors",
                              !notif.is_read
                                ? "bg-blue-50 dark:bg-blue-900/10"
                                : "bg-background"
                            )}
                          >
                            <td className="px-4 py-3 whitespace-nowrap">
                              <IconComponent
                                className={clsx(
                                  "h-5 w-5",
                                  getIconColor(notif.type)
                                )}
                                aria-label={`${notif.type} notification`}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="max-w-xs">
                                <p className="text-sm text-gray-900 truncate" title={notif.message}>
                                  {notif.message}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-sm font-mono text-gray-600">
                                {notif.user_email || "-"}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(notif.created_at), {
                                addSuffix: true,
                              })}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {notif.is_read ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Read
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 font-semibold">
                                  Unread
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => toggleRead(notif)}
                                disabled={isUpdating}
                                aria-label={
                                  notif.is_read ? "Mark as unread" : "Mark as read"
                                }
                              >
                                {notif.is_read ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-gray-50 px-4 py-3 border-t">
                    <div className="flex justify-between items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">
                          Page {page} of {totalPages}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({filtered.length} total)
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        aria-label="Next page"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="bg-gray-50 px-4 py-2 border-t">
                  <div className="text-sm text-gray-600">
                    Showing {paginated.length} of {filtered.length} notifications
                    {search && ` matching "${search}"`}
                    {typeFilter && ` of type "${typeFilter}"`}
                    {readFilter && ` that are ${readFilter}`}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
