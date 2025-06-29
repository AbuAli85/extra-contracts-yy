"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import { getUsers } from "@/lib/dashboard-data"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export default function DashboardUsersPage() {
  const t = useTranslations("DashboardUsersPage")

  const {
    data: usersData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">{t("loadingUsers")}</span>
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

  if (!usersData?.success || !usersData.data) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-red-500">
        {t("errorFetchingData")}: {usersData?.message || t("unknownError")}
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
          {usersData.data.length === 0 ? (
            <div className="py-8 text-center text-gray-500">{t("noUsersFound")}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("email")}</TableHead>
                    <TableHead>{t("role")}</TableHead>
                    <TableHead>{t("createdAt")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData.data.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.role}</Badge>
                      </TableCell>
                      <TableCell>{format(new Date(user.created_at), "PPP")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
