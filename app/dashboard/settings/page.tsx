"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function DashboardSettingsPage() {
  const t = useTranslations("DashboardSettingsPage")

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* General Settings */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("generalSettings")}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="appName">{t("appName")}</Label>
                <Input id="appName" defaultValue="Bilingual Contract Generator" />
              </div>
              <div>
                <Label htmlFor="defaultLanguage">{t("defaultLanguage")}</Label>
                <Input id="defaultLanguage" defaultValue="English" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="companyAddress">{t("companyAddress")}</Label>
                <Textarea id="companyAddress" defaultValue="123 Main St, Anytown, USA 12345" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Notification Settings */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("notificationSettings")}</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">{t("emailNotifications")}</Label>
                <Switch id="emailNotifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="smsNotifications">{t("smsNotifications")}</Label>
                <Switch id="smsNotifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="inAppNotifications">{t("inAppNotifications")}</Label>
                <Switch id="inAppNotifications" defaultChecked />
              </div>
            </div>
          </div>

          <Separator />

          {/* Security Settings */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("securitySettings")}</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="twoFactorAuth">{t("twoFactorAuth")}</Label>
                <Switch id="twoFactorAuth" />
              </div>
              <div>
                <Label htmlFor="password">{t("changePassword")}</Label>
                <Input id="password" type="password" placeholder={t("newPassword")} />
                <Button variant="outline" className="mt-2 bg-transparent">
                  {t("updatePassword")}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button>{t("saveChanges")}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
