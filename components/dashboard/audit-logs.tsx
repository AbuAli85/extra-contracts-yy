"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import type { AuditLog } from "@/lib/dashboard-types"
import { useTranslations } from "next-intl"
import { format } from "date-fns"

interface AuditLogsProps {
  logs: AuditLog[]
}

export function AuditLogs({ logs }: AuditLogsProps) {
  const t = useTranslations("AuditLogs")

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-muted-foreground">{t("noLogs")}</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("timestamp")}</TableHead>
                  <TableHead>{t("user")}</TableHead>
                  <TableHead>{t("action")}</TableHead>
                  <TableHead>{t("target")}</TableHead>
                  <TableHead>{t("details")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap text-sm">
                      {format(new Date(log.timestamp), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">{log.user}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm">{log.action}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm">{log.target}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
