import { getTranslations } from "next-intl/server"

import { getUsers } from "@/lib/dashboard-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default async function UsersPage() {
  const t = await getTranslations("DashboardUsersPage")
  const { data: users, error } = await getUsers()

  if (error) {
    console.error("Error fetching users:", error)
    return <div className="text-red-500">{t("errorLoadingUsers")}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <h1 className="mb-6 text-3xl font-bold">{t("userManagement")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("systemUsers")}</CardTitle>
        </CardHeader>
        <CardContent>
          {users && users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("email")}</TableHead>
                  <TableHead>{t("role")}</TableHead>
                  <TableHead>{t("createdAt")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>{format(new Date(user.createdAt), "PPP")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" disabled>
                        {t("edit")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500">{t("noUsersFound")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
