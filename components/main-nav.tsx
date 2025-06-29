"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

interface MainNavProps {
  items: {
    href: string
    label: string
    icon?: React.ElementType
  }[]
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname()
  const t = useTranslations("MainNav")

  return (
    <div className="hidden md:flex gap-6">
      <Link href="/" className="flex items-center space-x-2">
        <span className="inline-block font-bold">ContractGen</span>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === item.href ? "text-foreground" : "text-foreground/60",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
