import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PromoterForm from "@/components/promoter-form" // Default import
import { getPromoterById } from "@/app/actions/promoters"

interface EditPromoterPageProps {
  params: {
    id: string
  }
}

export default async function EditPromoterPage({ params }: EditPromoterPageProps) {
  const t = await getTranslations("EditPromoterPage")
  const { data: promoter, error } = await getPromoterById(params.id)

  if (error || !promoter) {
    console.error("Error fetching promoter for edit:", error)
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">{t("editPromoter")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("promoterDetails")}</CardTitle>
        </CardHeader>
        <CardContent>
          <PromoterForm initialData={promoter} />
        </CardContent>
      </Card>
    </div>
  )
}
