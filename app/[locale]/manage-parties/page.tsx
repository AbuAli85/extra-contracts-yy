"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { useParties } from "@/hooks/use-parties"
import { useTranslations } from "next-intl"
import { PlusCircle } from "lucide-react"
import { PartyForm } from "@/components/party-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Party } from "@/lib/types"
import { DeletePartyButton } from "@/components/delete-party-button"
import { Loader2 } from "lucide-react"

export default function ManagePartiesPage() {
  const t = useTranslations("ManagePartiesPage")
  const { data: parties, isLoading, isError, error } = useParties()
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingParty, setEditingParty] = useState<Party | null>(null)

  const filteredParties = useMemo(() => {
    if (!parties) return []
    return parties.filter((party) => party.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [parties, searchTerm])

  const handleEdit = (party: Party) => {
    setEditingParty(party)
    setIsFormOpen(true)
  }

  const handleNewPartyClick = () => {
    setEditingParty(null)
    setIsFormOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">{t("loadingParties")}</span>
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
              placeholder={t("searchParties")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleNewPartyClick}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t("newParty")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingParty ? t("editParty") : t("addParty")}</DialogTitle>
                </DialogHeader>
                <PartyForm party={editingParty} onFormSuccess={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {filteredParties.length === 0 ? (
            <div className="py-8 text-center text-gray-500">{t("noPartiesFound")}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("partyName")}</TableHead>
                    <TableHead>{t("partyType")}</TableHead>
                    <TableHead>{t("contactEmail")}</TableHead>
                    <TableHead>{t("contactPhone")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParties.map((party) => (
                    <TableRow key={party.id}>
                      <TableCell className="font-medium">{party.name}</TableCell>
                      <TableCell>{party.type}</TableCell>
                      <TableCell>{party.contact_email}</TableCell>
                      <TableCell>{party.contact_phone}</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(party)}>
                          {t("edit")}
                        </Button>
                        <DeletePartyButton partyId={party.id} />
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
