import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PromoterProfileForm } from "@/components/promoter-profile-form"
import { getPromoterById } from "@/lib/data"
import { notFound } from "next/navigation"

interface PromoterProfileTestPageProps {
  searchParams: {
    id?: string
  }
}

export default async function PromoterProfileTestPage({ searchParams }: PromoterProfileTestPageProps) {
  const promoterId = searchParams.id
  let initialData = undefined

  if (promoterId) {
    const promoter = await getPromoterById(promoterId)
    if (!promoter) {
      notFound()
    }
    initialData = {
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
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <h1 className="text-2xl font-semibold">Promoter Profile Test Form</h1>
      <Card>
        <CardHeader>
          <CardTitle>Promoter Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PromoterProfileForm initialData={initialData} promoterId={promoterId} />
        </CardContent>
      </Card>
    </main>
  )
}
