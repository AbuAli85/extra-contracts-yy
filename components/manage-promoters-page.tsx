"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getPromoters, deletePromoter } from "@/hooks/use-promoters"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { PlusIcon, PencilIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

export function ManagePromotersPage() {
  const t = useTranslations("ManagePromotersPage")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [promoterToDelete, setPromoterToDelete] = useState<string | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  const {
    data: promoters,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["promoters", searchTerm],
    queryFn: () => getPromoters(searchTerm),
  })

  const deleteMutation = useMutation({
    mutationFn: deletePromoter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promoters"] })
      toast({
        title: t("deleteSuccessTitle"),
        description: t("deleteSuccessMessage"),
      })
      setIsDeleteDialogOpen(false)
      setPromoterToDelete(null)
    },
    onError: (error) => {
      toast({
        title: t("deleteErrorTitle"),
        description: error.message || t("deleteErrorMessage"),
        variant: "destructive",
      })
    },
  })

  const handleDeleteClick = (promoterId: string) => {
    setPromoterToDelete(promoterId)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (promoterToDelete) {
      deleteMutation.mutate(promoterToDelete)
    }
  }

  if (isLoading) return <div>{t("loadingPromoters")}</div>
  if (isError) return <div>{t("errorLoadingPromoters")}</div>

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Button onClick={() => router.push("/manage-promoters/new")}>
          <PlusIcon className="mr-2 h-4 w-4" />
          {t("addPromoterButton")}
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("email")}</TableHead>
              <TableHead>{t("phone")}</TableHead>
              <TableHead>{t("company")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promoters?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("noPromotersFound")}
                </TableCell>
              </TableRow>
            ) : (
              promoters?.map((promoter) => (
                <TableRow key={promoter.id}>
                  <TableCell className="font-medium">{promoter.name}</TableCell>
                  <TableCell>{promoter.email}</TableCell>
                  <TableCell>{promoter.phone}</TableCell>
                  <TableCell>{promoter.company_name}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/manage-promoters/${promoter.id}/edit`}>
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">{t("edit")}</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDeleteClick(promoter.id)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                      <span className="sr-only">{t("delete")}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmDeleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("confirmDeleteDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancelButton")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>{t("continueButton")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
