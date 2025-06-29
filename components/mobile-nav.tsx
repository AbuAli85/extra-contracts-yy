"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Menu } from "lucide-react"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Link } from "@/navigation"
import { AuthStatus } from "./auth-status"
import { LanguageSwitcher } from "./language-switcher"
import { ThemeToggle } from "./theme-toggle"

export function MobileNav() {
  const t = useTranslations("MobileNav")
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t("toggleMenu")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Icons.logo className="mr-2 h-4 w-4" />
          <span className="font-bold">Bilingual Contracts</span>
        </Link>
        <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6 pr-8">
          <div className="flex flex-col space-y-3">
            <Link href="/generate-contract" onClick={() => setOpen(false)}>
              {t("generateContract")}
            </Link>
            <Link href="/contracts" onClick={() => setOpen(false)}>
              {t("viewContracts")}
            </Link>
            <Link href="/dashboard" onClick={() => setOpen(false)}>
              {t("dashboard")}
            </Link>
            <Link href="/manage-parties" onClick={() => setOpen(false)}>
              {t("manageParties")}
            </Link>
            <Link href="/manage-promoters" onClick={() => setOpen(false)}>
              {t("managePromoters")}
            </Link>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <AuthStatus />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
