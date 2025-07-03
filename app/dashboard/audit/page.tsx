"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import clsx from "clsx";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [error, setError] = useState<string | null>(null);

  // Fetch logs
  const fetchAuditLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("id, user_email, action, ip_address, timestamp, details")
        .order(sortKey, { ascending: sortDirection === "asc" });
      if (error) throw error;
      setLogs(data || []);
    } catch (err: any) {
      setError(err.message);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
    // Real-time updates
    const channel = supabase
      .channel("public:audit_logs:feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "audit_logs" },
        (payload) => {
          setLogs((prev) => [
            payload.new,
            ...prev,
          ]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line
  }, [sortKey, sortDirection]);

  // Filtering, sorting, and pagination
  const filteredLogs = useMemo(() => {
    let filtered = logs;
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          (log.user_email || "System").toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (log.ip_address && log.ip_address.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (log.details &&
            typeof log.details === "string" &&
            log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (log.details &&
            typeof log.details === "object" &&
            JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    // Sort
    filtered = [...filtered].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (sortKey === "timestamp") {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      }
      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortDirection === "asc" ? valA - valB : valB - valA;
    });
    return filtered;
  }, [logs, searchTerm, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, page, pageSize]);

  // Sorting
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Export to CSV
  const exportCSV = () => {
    const headers = ["Timestamp", "User", "Action", "IP Address", "Details"];
    const rows = filteredLogs.map((log) => [
      log.timestamp,
      log.user_email || "System",
      log.action,
      log.ip_address || "",
      typeof log.details === "object" ? JSON.stringify(log.details) : log.details || "",
    ]);
    const csv =
      [headers, ...rows]
        .map((row) =>
          row
            .map((cell) =>
              typeof cell === "string" && cell.includes(",")
                ? `"${cell.replace(/"/g, '""')}"`
                : cell
            )
            .join(",")
        )
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit_logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset page on filter/search/page size change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, pageSize]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Audit Logs / سجلات تدقيق النظام</CardTitle>
        <CardDescription>
          Track all system activities and user actions. Search, filter, sort, and export logs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs by user, action, IP, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8"
              aria-label="Search audit logs"
            />
          </div>
          <div className="flex gap-2 items-center">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border rounded px-2 py-1"
              aria-label="Page size"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={exportCSV} aria-label="Export CSV">
              <Download className="h-4 w-4 mr-1" /> Export CSV
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("timestamp")}
                  aria-sort={sortKey === "timestamp" ? sortDirection : undefined}
                >
                  Timestamp {sortKey === "timestamp" && (sortDirection === "asc" ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("user_email")}
                  aria-sort={sortKey === "user_email" ? sortDirection : undefined}
                >
                  User {sortKey === "user_email" && (sortDirection === "asc" ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("action")}
                  aria-sort={sortKey === "action" ? sortDirection : undefined}
                >
                  Action {sortKey === "action" && (sortDirection === "asc" ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("ip_address")}
                  aria-sort={sortKey === "ip_address" ? sortDirection : undefined}
                >
                  IP Address {sortKey === "ip_address" && (sortDirection === "asc" ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("details")}
                  aria-sort={sortKey === "details" ? sortDirection : undefined}
                >
                  Details {sortKey === "details" && (sortDirection === "asc" ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : paginatedLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <span className="text-4xl mb-2">🗒️</span>
                    <div>No logs found matching your criteria.</div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-blue-50 transition">
                    <TableCell>{log.timestamp ? format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss') : "-"}</TableCell>
                    <TableCell>{log.user_email || "System"}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.ip_address || "-"}</TableCell>
                    <TableCell>
                      {typeof log.details === "object"
                        ? JSON.stringify(log.details)
                        : log.details || "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
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
          Showing {paginatedLogs.length} of {filteredLogs.length} logs
        </div>
        {error && (
          <div className="text-red-600 mt-2" role="alert">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
