import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default async function IndexPage() {
  const t = await getTranslations("IndexPage")

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{t("heroTitle")}</h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">{t("heroDescription")}</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href="/generate-contract">
            {t("generateContractButton")} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/contracts">{t("viewContractsButton")}</Link>
        </Button>
      </div>
    </div>
  )
}
