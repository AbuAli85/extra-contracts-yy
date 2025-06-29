import { getTranslations } from "next-intl/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export default async function SettingsPage() {
  const t = await getTranslations("DashboardSettings")

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <h1 className="text-2xl font-semibold">{t("settingsTitle")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("generalSettings")}</CardTitle>
          <CardDescription>{t("generalSettingsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="appName">{t("appName")}</Label>
            <Input id="appName" defaultValue="Bilingual Contract Generator" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="companyName">{t("companyName")}</Label>
            <Input id="companyName" defaultValue="Acme Corp" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contactEmail">{t("contactEmail")}</Label>
            <Input id="contactEmail" type="email" defaultValue="support@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">{t("address")}</Label>
            <Textarea id="address" defaultValue="123 Main St, Anytown, USA" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="darkMode" defaultChecked />
            <Label htmlFor="darkMode">{t("darkModeToggle")}</Label>
          </div>
          <div className="flex justify-end">
            <Button>{t("saveChanges")}</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("notificationSettings")}</CardTitle>
          <CardDescription>{t("notificationSettingsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="emailNotifications" defaultChecked />
            <Label htmlFor="emailNotifications">{t("emailNotifications")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="smsNotifications" />
            <Label htmlFor="smsNotifications">{t("smsNotifications")}</Label>
          </div>
          <div className="flex justify-end">
            <Button>{t("saveChanges")}</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
