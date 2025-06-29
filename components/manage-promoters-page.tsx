"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { PlusCircle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PromoterForm } from "@/components/promoter-form" // Named import
import { usePromoters } from "@/hooks/use-promoters"
import { DeletePromoterButton } from "@/components/delete-promoter-button"
import Link from "next/link"

export function ManagePromotersPage() {
  const t = useTranslations("ManagePromotersPage")
  const { data: promoters, isLoading, isError, error } = usePromoters()
  const [showAddForm, setShowAddForm] = useState(false)

  if (isLoading) return <div>{t("loadingPromoters")}</div>
  if (isError)
    return (
      <div className="text-red-500">
        {t("errorLoadingPromoters")}: {error?.message}
      </div>
    )

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">{t("managePromoters")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t("addNewPromoter")}</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {showAddForm ? t("hideForm") : t("addPromoter")}
            </Button>
          </CardHeader>
          <CardContent>{showAddForm && <PromoterForm onSuccess={() => setShowAddForm(false)} />}</CardContent>
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
