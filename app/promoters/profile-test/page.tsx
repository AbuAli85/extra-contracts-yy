"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PromoterProfileForm } from "@/components/promoter-profile-form"
import { useTranslations } from "next-intl"

export default function PromoterProfileTestPage() {
  const t = useTranslations("PromoterProfileTestPage")

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <PromoterProfileForm />
        </CardContent>
      </Card>
    </div>
  )
}
