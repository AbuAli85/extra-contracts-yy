"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface MobileNavProps {
  items: {
    href: string
    label: string
    icon?: React.ElementType
  }[]
}

export function MobileNav({ items }: MobileNavProps) {
  const pathname = usePathname()
  const t = useTranslations("MobileNav")
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">{t("toggleMenu")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Link href="/" className="flex items-center space-x-2 mb-6" onClick={() => setOpen(false)}>
          <span className="inline-block font-bold">ContractGen</span>
        </Link>
        <nav className="flex flex-col gap-4 text-sm">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 py-2 transition-colors hover:text-foreground/80",
                pathname === item.href ? "text-foreground font-medium" : "text-foreground/60",
              )}
              onClick={() => setOpen(false)}
            >
              {item.icon && <item.icon className="h-5 w-5" />}
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
