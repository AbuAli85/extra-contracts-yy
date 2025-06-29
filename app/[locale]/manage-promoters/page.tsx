"use client"
import { useEffect, useState, useRef } from "react"
import { CardDescription } from "@/components/ui/card"
import { getTranslations } from "next-intl/server"
import { getPromoters } from "@/lib/data"
import PromoterForm from "@/components/promoter-form"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import type { Promoter } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EditIcon, ArrowLeftIcon, Loader2, PlusCircleIcon, Trash2Icon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { getDocumentStatus } from "@/lib/document-status"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { deletePromoter } from "@/app/actions/promoters"
import { revalidatePath } from "next/cache"

interface ManagePromotersPageProps {
  params: {
    locale: string
  }
}

export default async function ManagePromotersPage({ params }: ManagePromotersPageProps) {
  const t = await getTranslations("ManagePromotersPage")
  const [promoters, setPromoters] = useState<Promoter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPromoter, setSelectedPromoter] = useState<Promoter | null>(null)
  const [showForm, setShowForm] = useState(false)
  const { toast } = useToast()
  const isMountedRef = useRef(true)

  async function fetchPromotersWithContractCount() {
    if (isMountedRef.current) setIsLoading(true)
    const promotersData = await getPromoters()

    if (!promotersData || promotersData.length === 0) {
      if (isMountedRef.current) {
        setPromoters([])
        setIsLoading(false)
      }
      return
    }

    // Fetch active contract counts for each promoter
    const promoterIds = promotersData.map((p) => p.id)
    const { data: contractsData, error: contractsError } = await supabase
      .from("contracts")
      .select("promoter_id, contract_end_date")
      .in("promoter_id", promoterIds)

    if (contractsError) {
      toast({
        title: "Error fetching contract data",
        description: contractsError.message,
        variant: "destructive",
      })
      // Continue with promoters data but without contract counts
    }

    const todayStr = format(new Date(), "yyyy-MM-dd")

    const promotersWithCounts = promotersData.map((promoter) => {
      const activeContracts = contractsData
        ? contractsData.filter(
            (c) => c.promoter_id === promoter.id && c.contract_end_date && c.contract_end_date >= todayStr,
          ).length
        : 0
      return { ...promoter, active_contracts_count: activeContracts }
    })

    if (isMountedRef.current) {
      setPromoters(promotersWithCounts)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    isMountedRef.current = true
    fetchPromotersWithContractCount()
    const promotersChannel = supabase
      .channel("public:promoters:manage")
      .on("postgres_changes", { event: "*", schema: "public", table: "promoters" }, () =>
        fetchPromotersWithContractCount(),
      )
      .subscribe()

    const contractsChannel = supabase
      .channel("public:contracts:manage")
      .on("postgres_changes", { event: "*", schema: "public", table: "contracts" }, () =>
        fetchPromotersWithContractCount(),
      )
      .subscribe()

    return () => {
      isMounted = false
      isMountedRef.current = false
      supabase.removeChannel(promotersChannel)
      supabase.removeChannel(contractsChannel)
    }
  }, [])

  const handleEdit = (promoter: Promoter) => {
    setSelectedPromoter(promoter)
    setShowForm(true)
  }

  const handleAddNew = () => {
    setSelectedPromoter(null)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setSelectedPromoter(null)
    fetchPromotersWithContractCount() // Refresh the list
  }

  const handleDelete = async (id: string) => {
    "use server"
    await deletePromoter(id)
    revalidatePath(`/${params.locale}/manage-promoters`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-3 text-lg text-slate-700 dark:text-slate-300">Loading promoters...</p>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Button variant="outline" onClick={handleFormClose} className="mb-6 bg-transparent">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            {t("backToPromoterList")}
          </Button>
          <PromoterForm promoterToEdit={selectedPromoter} onFormSubmit={handleFormClose} />
        </div>
      </div>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold">{t("managePromotersTitle")}</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              {t("newPromoter")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t("addPromoterTitle")}</DialogTitle>
              <DialogDescription>{t("addPromoterDescription")}</DialogDescription>
            </DialogHeader>
            <PromoterForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg bg-card">
        <CardHeader className="border-b">
          <CardTitle className="text-xl">{t("allPromoters")}</CardTitle>
          <CardDescription>{t("viewEditPromoterDetails")}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {promoters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>{t("noPromotersFound")}</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {promoters.map((promoter) => {
                  const idCardStatus = getDocumentStatus(promoter.id_card_expiry_date)
                  const passportStatus = getDocumentStatus(promoter.passport_expiry_date)
                  return (
                    <div key={promoter.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold text-lg">{promoter.name_en}</h3>
                        <p className="text-sm text-muted-foreground">{promoter.name_ar}</p>
                        <p className="text-sm text-muted-foreground">{promoter.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <EditIcon className="h-4 w-4" />
                              <span className="sr-only">{t("edit")}</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>{t("editPromoterTitle")}</DialogTitle>
                              <DialogDescription>{t("editPromoterDescription")}</DialogDescription>
                            </DialogHeader>
                            <PromoterForm initialData={promoter} />
                          </DialogContent>
                        </Dialog>
                        <form action={handleDelete.bind(null, promoter.id)}>
                          <Button variant="destructive" size="sm" type="submit">
                            <Trash2Icon className="h-4 w-4" />
                            <span className="sr-only">{t("delete")}</span>
                          </Button>
                        </form>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
