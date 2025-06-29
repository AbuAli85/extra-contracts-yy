"use client"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search, Loader2, ArrowUpDown } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { devLog } from "@/lib/dev-log"
import type { AuditLogItem, AuditLogRow, AuditLog } from "@/lib/dashboard-types"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { useTranslations } from "next-intl"

type AuditSortKey = keyof AuditLogItem | "user" | "action" | "ipAddress" | "timestamp" | "details" | "target" | null

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortKey, setSortKey] = useState<AuditSortKey>("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const { toast } = useToast()
  const t = useTranslations("DashboardAuditLogs")

  const fetchAuditLogs = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("id, user_email, action, ip_address, timestamp, details, target")
        .order(sortKey || "timestamp", { ascending: sortDirection === "asc" })
        .limit(100)

      if (error) throw error
      setLogs(
        data.map((log: AuditLogRow) => ({
          id: log.id,
          user: log.user_email || "System",
          action: log.action,
          ipAddress: log.ip_address || "N/A",
          timestamp: log.timestamp, // This is already an ISO string
          details: log.details,
          target: log.target || "N/A",
        })),
      )
    } catch (error: any) {
      console.error("Error fetching audit logs:", error)
      toast({ title: "Error Fetching Audit Logs", description: error.message, variant: "destructive" })
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuditLogs()
  }, [sortKey, sortDirection])

  useEffect(() => {
    const channel = supabase
      .channel("public:audit_logs:feed") // Unique channel name
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "audit_logs" }, (payload) => {
        const newLog = payload.new as AuditLogRow
        devLog("New audit log received:", newLog)
        toast({
          title: "New Audit Log Entry",
          description: `${newLog.user_email || "System"} performed action: ${newLog.action}`,
        })
        setLogs(
          (prev) =>
            [
              {
                id: newLog.id,
                user: newLog.user_email || "System",
                action: newLog.action,
                ipAddress: newLog.ip_address || "N/A",
                timestamp: newLog.timestamp,
                details: newLog.details,
                target: newLog.target || "N/A",
              },
              ...prev,
            ]
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Ensure sort order is maintained
              .slice(0, 100), // Keep list size manageable
        )
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const filteredLogs = useMemo(() => {
    if (!logs) return []
    return logs.filter(
      (log) =>
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.ipAddress && log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.details &&
          typeof log.details === "string" && // Basic check for string details
          log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.details &&
          typeof log.details === "object" &&
          JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase())) || // Search in stringified JSON
        (log.target && log.target.toLowerCase().includes(searchTerm.toLowerCase())), // Search in target
    )
  }, [logs, searchTerm])

  const handleSort = (key: AuditSortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  const SortableHeader = ({ tKey, label, labelAr }: { tKey: AuditSortKey; label: string; labelAr: string }) => (
    <TableHead onClick={() => handleSort(tKey)} className="cursor-pointer hover:bg-muted/50">
      <div className="flex items-center">
        {label} / {labelAr}
        {sortKey === tKey && <ArrowUpDown className="ml-2 h-4 w-4" />}
      </div>
    </TableHead>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("auditLogs")}</CardTitle>
        <CardDescription>{t("trackSystemActivities")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchLogs")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <ScrollArea className="h-[400px] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader tKey="timestamp" label={t("timestamp")} labelAr={t("timestampAr")} />
                <SortableHeader tKey="user" label={t("user")} labelAr={t("userAr")} />
                <SortableHeader tKey="action" label={t("action")} labelAr={t("actionAr")} />
                <SortableHeader tKey="target" label={t("target")} labelAr={t("targetAr")} />
                <SortableHeader tKey="details" label={t("details")} labelAr={t("detailsAr")} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                  </TableCell>
                </TableRow>
              )}
              {!loading && filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {t("noLogsFound")}
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">{format(new Date(log.timestamp), "PPP p")}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.target}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {typeof log.details === "object" ? JSON.stringify(log.details) : log.details || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
