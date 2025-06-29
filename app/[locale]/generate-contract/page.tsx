"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContractGeneratorForm } from "@/components/contract-generator-form"
import { useTranslations } from "next-intl"

export default function GenerateContractPage() {
  const t = useTranslations("GenerateContractPage")

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ContractGeneratorForm />
        </CardContent>
      </Card>
    </div>
  )
}
