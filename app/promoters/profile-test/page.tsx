import { getTranslations } from "next-intl/server"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PromoterProfileForm } from "@/components/promoter-profile-form"

export default async function PromoterProfileTestPage() {
  const t = await getTranslations("PromoterProfileTestPage")

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">{t("promoterProfileTest")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("profileForm")}</CardTitle>
        </CardHeader>
        <CardContent>
          <PromoterProfileForm />
        </CardContent>
      </Card>
    </div>
  )
}
