"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import Link from "next/link"

export default function HomePage() {
  const t = useTranslations("HomePage")

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-4 text-center">
      <Card className="w-full max-w-2xl p-8">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">{t("welcomeTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">{t("welcomeMessage")}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/generate-contract">{t("generateContract")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contracts">{t("viewContracts")}</Link>
            </Button>
          </div>
          <div className="mt-8 text-sm text-muted-foreground">
            <p>{t("learnMore")}</p>
            <Link href="/dashboard" className="text-primary hover:underline">
              {t("goToDashboard")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
