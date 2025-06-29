import { getTranslations } from "next-intl/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircleIcon, EditIcon, Trash2Icon } from "lucide-react"
import { getParties } from "@/lib/data"
import { PartyForm } from "@/components/party-form"
import { deleteParty } from "@/app/actions/parties"
import { revalidatePath } from "next/cache"
import type { Party } from "@/lib/types"

interface ManagePartiesPageProps {
  params: {
    locale: string
  }
}

export default async function ManagePartiesPage({ params }: ManagePartiesPageProps) {
  const t = await getTranslations("ManagePartiesPage")
  const parties = await getParties()

  const handleDelete = async (id: string) => {
    "use server"
    await deleteParty(id)
    revalidatePath(`/${params.locale}/manage-parties`)
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold">{t("managePartiesTitle")}</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              {t("newParty")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t("addPartyTitle")}</DialogTitle>
              <DialogDescription>{t("addPartyDescription")}</DialogDescription>
            </DialogHeader>
            <PartyForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("allParties")}</CardTitle>
        </CardHeader>
        <CardContent>
          {parties.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>{t("noPartiesFound")}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {parties.map((party: Party) => (
                <div key={party.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold text-lg">{party.name_en}</h3>
                    <p className="text-sm text-muted-foreground">{party.name_ar}</p>
                    <p className="text-sm text-muted-foreground">{party.type}</p>
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
                          <DialogTitle>{t("editPartyTitle")}</DialogTitle>
                          <DialogDescription>{t("editPartyDescription")}</DialogDescription>
                        </DialogHeader>
                        <PartyForm initialData={party} />
                      </DialogContent>
                    </Dialog>
                    <form action={handleDelete.bind(null, party.id)}>
                      <Button variant="destructive" size="sm" type="submit">
                        <Trash2Icon className="h-4 w-4" />
                        <span className="sr-only">{t("delete")}</span>
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
