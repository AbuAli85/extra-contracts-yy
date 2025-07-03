"use client";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, XCircle, AlertTriangle, Info, BellRing, Trash2, Eye, EyeOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import clsx from "clsx";

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  default: BellRing,
};

const getIconColor = (type) => {
  if (type === "success") return "text-green-500";
  if (type === "error") return "text-red-500";
  if (type === "warning") return "text-orange-500";
  return "text-blue-500";
};

const NOTIF_TYPES = ["success", "error", "warning", "info"];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [readFilter, setReadFilter] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notifications")
      .select(
        "id, type, message, created_at, user_email, related_contract_id, related_entity_id, related_entity_type, is_read"
      )
      .order("created_at", { ascending: false });
    setNotifications(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    const channel = supabase
      .channel("public:notifications:feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const newNotif = payload.new;
          setNotifications((prev) => [newNotif, ...prev]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filtering, searching, and pagination
  const filtered = useMemo(() => {
    let filtered = notifications;
    if (search) {
      filtered = filtered.filter(
        (n) =>
          n.message.toLowerCase().includes(search.toLowerCase()) ||
          (n.user_email && n.user_email.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (typeFilter) {
      filtered = filtered.filter((n) => n.type === typeFilter);
    }
    if (readFilter) {
      filtered = filtered.filter((n) =>
        readFilter === "read" ? n.is_read : !n.is_read
      );
    }
    return filtered;
  }, [notifications, search, typeFilter, readFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Mark as read/unread
  const toggleRead = async (notif) => {
    await supabase
      .from("notifications")
      .update({ is_read: !notif.is_read })
      .eq("id", notif.id);
    fetchNotifications();
  };

  // Bulk mark all as read
  const markAllAsRead = async () => {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("is_read", false);
    fetchNotifications();
  };

  // Bulk clear all
  const clearAll = async () => {
    await supabase.from("notifications").delete().neq("id", "");
    fetchNotifications();
  };

  // Reset page on filter/search
  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, readFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>All Notifications / جميع الإشعارات</CardTitle>
            <CardDescription>
              View, search, and manage all system notifications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="flex gap-2">
                <Input
                  type="search"
                  placeholder="Search notifications..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-56"
                  aria-label="Search notifications"
                />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="border rounded px-2 py-1"
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
                  className="border rounded px-2 py-1"
                  aria-label="Filter by read/unread"
                >
                  <option value="">All</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={markAllAsRead}
                  disabled={notifications.every((n) => n.is_read)}
                  aria-label="Mark all as read"
                >
                  <Eye className="h-4 w-4 mr-1" /> Mark all as read
                </Button>
                <Button
                  variant="destructive"
                  onClick={clearAll}
                  aria-label="Clear all notifications"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Clear all
                </Button>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin mr-2" /> Loading notifications...
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center py-12">
                <span className="text-6xl mb-2">🔔</span>
                <p className="text-gray-500">No notifications found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Message</th>
                      <th className="px-4 py-2 text-left">User</th>
                      <th className="px-4 py-2 text-left">Time</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((notif) => {
                      const IconComponent = iconMap[notif.type] || iconMap.default;
                      return (
                        <tr
                          key={notif.id}
                          className={clsx(
                            !notif.is_read
                              ? "bg-blue-50 dark:bg-blue-900/10"
                              : "bg-white"
                          )}
                        >
                          <td className="px-4 py-2">
                            <IconComponent
                              className={clsx(
                                "h-5 w-5",
                                getIconColor(notif.type)
                              )}
                            />
                          </td>
                          <td className="px-4 py-2">{notif.message}</td>
                          <td className="px-4 py-2 font-mono">
                            {notif.user_email || "-"}
                          </td>
                          <td className="px-4 py-2 text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notif.created_at), {
                              addSuffix: true,
                            })}
                          </td>
                          <td className="px-4 py-2">
                            {notif.is_read ? (
                              <span className="text-green-600">Read</span>
                            ) : (
                              <span className="text-blue-600 font-semibold">
                                Unread
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => toggleRead(notif)}
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
                      );
                    })}
                  </tbody>
                </table>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" /> Prev
                    </Button>
                    <span>
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      aria-label="Next page"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="text-sm text-muted-foreground mt-2">
                  Showing {paginated.length} of {filtered.length} notifications
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
