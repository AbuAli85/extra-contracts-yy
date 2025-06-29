import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PromoterForm } from "@/components/promoter-form"
import { getPromoterById } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

interface EditPromoterPageProps {
  params: {
    id: string
  }
}

export default async function EditPromoterPage({ params }: EditPromoterPageProps) {
  const promoter = await getPromoterById(params.id)

  if (!promoter) {
    notFound()
  }

  const initialData = {
    nameEn: promoter.name_en,
    nameAr: promoter.name_ar,
    email: promoter.email,
    phone: promoter.phone || "",
    address: promoter.address || "",
    city: promoter.city || "",
    country: promoter.country || "",
    zipCode: promoter.zip_code || "",
    contactPerson: promoter.contact_person || "",
    contactPersonEmail: promoter.contact_person_email || "",
    contactPersonPhone: promoter.contact_person_phone || "",
    website: promoter.website || "",
    logoUrl: promoter.logo_url || "",
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/manage-promoters`}>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Promoters
          </Link>
        </Button>
        <h1 className="ml-auto text-2xl font-semibold">Edit Promoter</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Promoter Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PromoterForm initialData={initialData} promoterId={promoter.id} />
        </CardContent>
      </Card>
    </main>
  )
}
