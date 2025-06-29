"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  PanelLeftIcon,
  FileTextIcon,
  UsersIcon,
  BarChartIcon,
  BellIcon,
  SettingsIcon,
  LogOutIcon,
  HomeIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const t = useTranslations("DashboardLayout")
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const navItems = [
    { href: "/dashboard", icon: HomeIcon, label: t("home") },
    { href: "/dashboard/analytics", icon: BarChartIcon, label: t("analytics") },
    { href: "/dashboard/contracts", icon: FileTextIcon, label: t("contracts") },
    { href: "/dashboard/notifications", icon: BellIcon, label: t("notifications") },
    { href: "/dashboard/audit", icon: UsersIcon, label: t("auditLogs") },
    { href: "/dashboard/users", icon: UsersIcon, label: t("users") },
    { href: "/dashboard/settings", icon: SettingsIcon, label: t("settings") },
  ]

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: t("logoutError"),
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: t("logoutSuccess"),
        description: t("logoutSuccessMessage"),
      })
      router.push("/login")
    }
    setIsLoggingOut(false)
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <FileTextIcon className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Contract App</span>
          </Link>
          <TooltipProvider>
            {navItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                      pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleLogout} disabled={isLoggingOut}>
                  <LogOutIcon className="h-5 w-5" />
                  <span className="sr-only">{t("logout")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{t("logout")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden bg-transparent">
                <PanelLeftIcon className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground"
                >
                  <FileTextIcon className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Contract App</span>
                </Link>
                <Separator />
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 px-2.5 ${
                      pathname === item.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
                <Separator />
                <Button
                  variant="ghost"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOutIcon className="h-5 w-5" />
                  {t("logout")}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          <h1 className="font-semibold text-lg md:text-2xl">
            {navItems.find((item) => pathname.startsWith(item.href))?.label || t("dashboard")}
          </h1>
        </header>
        {children}
      </div>
    </div>
  )
}
