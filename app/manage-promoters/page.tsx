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
import { PlusCircleIcon, EditIcon, Trash2Icon, EyeIcon } from "lucide-react"
import { getPromoters } from "@/lib/data"
import { PromoterForm } from "@/components/promoter-form"
import { deletePromoter } from "@/app/actions/promoters"
import { revalidatePath } from "next/cache"
import type { Promoter } from "@/lib/types"
import Link from "next/link"

export default async function ManagePromotersPage() {
  const promoters = await getPromoters()

  const handleDelete = async (id: string) => {
    "use server"
    await deletePromoter(id)
    revalidatePath("/manage-promoters")
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold">Manage Promoters</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              New Promoter
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Promoter</DialogTitle>
              <DialogDescription>Fill in the details to add a new promoter.</DialogDescription>
            </DialogHeader>
            <PromoterForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Promoters</CardTitle>
        </CardHeader>
        <CardContent>
          {promoters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No promoters found. Add a new promoter to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {promoters.map((promoter: Promoter) => (
                <div key={promoter.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold text-lg">{promoter.name_en}</h3>
                    <p className="text-sm text-muted-foreground">{promoter.name_ar}</p>
                    <p className="text-sm text-muted-foreground">{promoter.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/manage-promoters/${promoter.id}`}>
                        <EyeIcon className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <EditIcon className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Edit Promoter</DialogTitle>
                          <DialogDescription>Update the details for this promoter.</DialogDescription>
                        </DialogHeader>
                        <PromoterForm initialData={promoter} promoterId={promoter.id} />
                      </DialogContent>
                    </Dialog>
                    <form action={handleDelete.bind(null, promoter.id)}>
                      <Button variant="destructive" size="sm" type="submit">
                        <Trash2Icon className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
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
