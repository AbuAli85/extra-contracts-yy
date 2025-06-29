import { getTranslations } from "next-intl/server"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default async function SettingsPage() {
  const t = await getTranslations("DashboardSettingsPage")

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">{t("settings")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("generalSettings")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="appName">{t("applicationName")}</Label>
            <Input id="appName" defaultValue="Bilingual Contract Generator" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contactEmail">{t("contactEmail")}</Label>
            <Input id="contactEmail" type="email" defaultValue="support@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="legalDisclaimer">{t("legalDisclaimer")}</Label>
            <Textarea
              id="legalDisclaimer"
              defaultValue="All contracts generated through this platform are for informational purposes only and do not constitute legal advice."
              rows={4}
            />
          </div>
          <Button>{t("saveChanges")}</Button>
        </CardContent>
      </Card>
    </div>
  )
}
