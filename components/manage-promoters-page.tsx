"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { usePromoters } from "@/hooks/use-promoters"
import { useTranslations } from "next-intl"
import { PlusCircle } from "lucide-react"
import { PromoterForm } from "@/components/promoter-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Promoter } from "@/lib/types"
import { DeletePromoterButton } from "@/components/delete-promoter-button"
import { Loader2 } from "lucide-react"

export function ManagePromotersPage() {
  const t = useTranslations("ManagePromotersPage")
  const { data: promoters, isLoading, isError, error } = usePromoters()
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPromoter, setEditingPromoter] = useState<Promoter | null>(null)

  const filteredPromoters = useMemo(() => {
    if (!promoters) return []
    return promoters.filter((promoter) => promoter.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [promoters, searchTerm])

  const handleEdit = (promoter: Promoter) => {
    setEditingPromoter(promoter)
    setIsFormOpen(true)
  }

  const handleNewPromoterClick = () => {
    setEditingPromoter(null)
    setIsFormOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">{t("loadingPromoters")}</span>
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

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>{t("title")}</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder={t("searchPromoters")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleNewPromoterClick}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t("newPromoter")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingPromoter ? t("editPromoter") : t("addPromoter")}</DialogTitle>
                </DialogHeader>
                <PromoterForm promoter={editingPromoter} onFormSuccess={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPromoters.length === 0 ? (
            <div className="py-8 text-center text-gray-500">{t("noPromotersFound")}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("promoterName")}</TableHead>
                    <TableHead>{t("contactEmail")}</TableHead>
                    <TableHead>{t("contactPhone")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPromoters.map((promoter) => (
                    <TableRow key={promoter.id}>
                      <TableCell className="font-medium">{promoter.name}</TableCell>
                      <TableCell>{promoter.contact_email}</TableCell>
                      <TableCell>{promoter.contact_phone}</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(promoter)}>
                          {t("edit")}
                        </Button>
                        <DeletePromoterButton promoterId={promoter.id} />
                      </TableCell>
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
