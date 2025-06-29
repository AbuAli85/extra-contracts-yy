import { getTranslations } from "next-intl/server"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import PromoterForm from "@/components/promoter-form" // Default import
import { getPromoters } from "@/app/actions/promoters"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeletePromoterButton } from "@/components/delete-promoter-button"

export default async function ManagePromotersPage() {
  const t = await getTranslations("ManagePromotersPage")
  const { data: promoters, error } = await getPromoters()

  if (error) {
    console.error("Error fetching promoters:", error)
    return <div className="text-red-500">{t("errorLoadingPromoters")}</div>
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">{t("managePromoters")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("addNewPromoter")}</CardTitle>
          </CardHeader>
          <CardContent>
            <PromoterForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("existingPromoters")}</CardTitle>
          </CardHeader>
          <CardContent>
            {promoters && promoters.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("email")}</TableHead>
                    <TableHead>{t("company")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promoters.map((promoter) => (
                    <TableRow key={promoter.id}>
                      <TableCell className="font-medium">{promoter.name}</TableCell>
                      <TableCell>{promoter.email}</TableCell>
                      <TableCell>{promoter.company}</TableCell>
                      <TableCell className="text-right flex gap-2 justify-end">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/manage-promoters/${promoter.id}/edit`}>{t("edit")}</Link>
                        </Button>
                        <DeletePromoterButton promoterId={promoter.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-gray-500">{t("noPromotersFound")}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
