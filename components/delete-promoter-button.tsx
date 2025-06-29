"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Trash2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { deletePromoter } from "@/app/actions/promoters"

interface DeletePromoterButtonProps {
  promoterId: string
}

export function DeletePromoterButton({ promoterId }: DeletePromoterButtonProps) {
  const t = useTranslations("DeletePromoterButton")
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deletePromoter(promoterId)
    if (result.success) {
      toast({
        title: t("success"),
        description: result.message,
      })
    } else {
      toast({
        title: t("error"),
        description: result.message,
        variant: "destructive",
      })
    }
    setIsDeleting(false)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isDeleting}>
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          <span className="sr-only">{t("delete")}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("areYouAbsolutelySure")}</AlertDialogTitle>
          <AlertDialogDescription>{t("deleteConfirmation")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? t("deleting") : t("continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
