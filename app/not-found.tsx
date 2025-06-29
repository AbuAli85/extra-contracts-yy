import { getTranslations } from "next-intl/server"
import { Link } from "@/navigation" // Named import
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default async function NotFound() {
  const t = await getTranslations("NotFoundPage")

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-5xl font-bold text-primary">{t("title")}</CardTitle>
          <CardDescription className="text-xl text-muted-foreground">{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t("message")}</p>
          <Button asChild>
            <Link href="/">{t("goHome")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
