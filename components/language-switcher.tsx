"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("LanguageSwitcher")

  const onSelectChange = (nextLocale: string) => {
    const newPath = `/${nextLocale}${pathname.substring(3)}` // Assumes locale is always 2 chars
    router.replace(newPath)
  }

  return (
    <Select value={locale} onValueChange={onSelectChange}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder={t("selectLanguage")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{t("english")}</SelectItem>
        <SelectItem value="ar">{t("arabic")}</SelectItem>
      </SelectContent>
    </Select>
  )
}
