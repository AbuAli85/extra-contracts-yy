"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, FileTextIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTranslations } from "next-intl"

export function MobileNav() {
  const t = useTranslations("MainNav")
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/contracts", label: t("contracts") },
    { href: "/generate-contract", label: t("generateContract") },
    { href: "/manage-parties", label: t("manageParties") },
    { href: "/manage-promoters", label: t("managePromoters") },
    { href: "/dashboard", label: t("dashboard") },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Link href="/" className="flex items-center space-x-2">
          <FileTextIcon className="h-6 w-6" />
          <span className="inline-block font-bold">ContractApp</span>
        </Link>
        <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6 pr-1">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname.startsWith(item.href) ? "text-foreground" : "text-foreground/60",
                )}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
