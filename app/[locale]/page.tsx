import { getTranslations } from "next-intl/server"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileTextIcon, UsersIcon, BarChartIcon } from "lucide-react"

interface HomePageProps {
  params: {
    locale: string
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const t = await getTranslations("HomePage")

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-4 md:p-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{t("welcomeTitle")}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("welcomeDescription")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Card className="flex flex-col items-center text-center p-6">
          <FileTextIcon className="h-12 w-12 text-primary mb-4" />
          <CardTitle className="mb-2">{t("contractsCardTitle")}</CardTitle>
          <CardDescription className="mb-4">{t("contractsCardDescription")}</CardDescription>
          <Button asChild>
            <Link href={`/${params.locale}/contracts`}>{t("contractsCardButton")}</Link>
          </Button>
        </Card>

        <Card className="flex flex-col items-center text-center p-6">
          <UsersIcon className="h-12 w-12 text-primary mb-4" />
          <CardTitle className="mb-2">{t("partiesPromotersCardTitle")}</CardTitle>
          <CardDescription className="mb-4">{t("partiesPromotersCardDescription")}</CardDescription>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/${params.locale}/manage-parties`}>{t("managePartiesButton")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/${params.locale}/manage-promoters`}>{t("managePromotersButton")}</Link>
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col items-center text-center p-6">
          <BarChartIcon className="h-12 w-12 text-primary mb-4" />
          <CardTitle className="mb-2">{t("dashboardCardTitle")}</CardTitle>
          <CardDescription className="mb-4">{t("dashboardCardDescription")}</CardDescription>
          <Button asChild>
            <Link href="/dashboard">{t("dashboardCardButton")}</Link>
          </Button>
        </Card>
      </div>
    </main>
  )
}
