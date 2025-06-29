import type React from "react"
import { getTranslations } from "next-intl/server"
import { Home, BarChart3, FileText, Users, Bell, Settings } from "lucide-react"

import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { AuthStatus } from "@/components/auth-status"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle" // Named import

interface DashboardLayoutProps {
  children: React.ReactNode
}

export async function DashboardLayout({ children }: DashboardLayoutProps) {
  const t = await getTranslations("DashboardLayout")

  const navItems = [
    { href: "/dashboard", label: t("overview"), icon: Home },
    { href: "/dashboard/analytics", label: t("analytics"), icon: BarChart3 },
    { href: "/dashboard/contracts", label: t("contracts"), icon: FileText },
    { href: "/dashboard/users", label: t("users"), icon: Users },
    { href: "/dashboard/notifications", label: t("notifications"), icon: Bell },
    { href: "/dashboard/settings", label: t("settings"), icon: Settings },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={navItems} />
          <MobileNav items={navItems} />
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <AuthStatus />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-background py-6 text-center text-sm text-muted-foreground">
        <div className="container">{t("footerText")}</div>
      </footer>
    </div>
  )
}
