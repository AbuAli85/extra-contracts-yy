import { getTranslations } from "next-intl/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getUsers } from "@/lib/dashboard-data"
import { format } from "date-fns"

export default async function UsersPage() {
  const t = await getTranslations("DashboardUsers")
  const users = await getUsers()

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <h1 className="text-2xl font-semibold">{t("usersTitle")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("allUsers")}</CardTitle>
          <CardDescription>{t("allUsersDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("email")}</TableHead>
                <TableHead>{t("role")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("createdAt")}</TableHead>
                <TableHead>{t("lastSignIn")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {t("noUsersFound")}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>{format(new Date(user.created_at), "PPP")}</TableCell>
                    <TableCell>
                      {user.last_sign_in_at ? format(new Date(user.last_sign_in_at), "PPP p") : "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
