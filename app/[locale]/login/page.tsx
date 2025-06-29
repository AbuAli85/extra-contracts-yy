import { getTranslations } from "next-intl/server"
import { AuthForm } from "@/components/auth-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LoginPageProps {
  params: {
    locale: string
  }
}

export default async function LoginPage({ params }: LoginPageProps) {
  const t = await getTranslations("LoginPage")

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm />
        </CardContent>
      </Card>
    </div>
  )
}
