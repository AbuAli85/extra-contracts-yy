"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useTranslations } from "next-intl"
import { LayoutDashboard, BarChart, FileText, Bell, Users, Settings, ArrowLeftRight, UserRound } from "lucide-react"
import { Link } from "@/navigation"
import { AuthStatus } from "../auth-status"
import { LanguageSwitcher } from "../language-switcher"
import { ThemeToggle } from "../theme-toggle"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const t = useTranslations("DashboardLayout")
  const pathname = usePathname()

  const navItems = [
    {
      title: t("overview"),
      href: "/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard",
    },
    {
      title: t("analytics"),
      href: "/dashboard/analytics",
      icon: BarChart,
      isActive: pathname === "/dashboard/analytics",
    },
    {
      title: t("contracts"),
      href: "/dashboard/contracts",
      icon: FileText,
      isActive: pathname === "/dashboard/contracts",
    },
    {
      title: t("parties"),
      href: "/manage-parties",
      icon: ArrowLeftRight,
      isActive: pathname === "/manage-parties",
    },
    {
      title: t("promoters"),
      href: "/manage-promoters",
      icon: UserRound,
      isActive: pathname === "/manage-promoters",
    },
    {
      title: t("notifications"),
      href: "/dashboard/notifications",
      icon: Bell,
      isActive: pathname === "/dashboard/notifications",
    },
    {
      title: t("users"),
      href: "/dashboard/users",
      icon: Users,
      isActive: pathname === "/dashboard/users",
    },
    {
      title: t("auditLogs"),
      href: "/dashboard/audit",
      icon: FileText, // Reusing FileText for audit logs, consider a different icon if available
      isActive: pathname === "/dashboard/audit",
    },
    {
      title: t("settings"),
      href: "/dashboard/settings",
      icon: Settings,
      isActive: pathname === "/dashboard/settings",
    },
  ]

  return (
    <div className="flex flex-1">
      <Sidebar className="hidden lg:flex">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex flex-1 flex-col">
        <div className="flex h-16 items-center justify-end gap-4 border-b px-4 lg:justify-end">
          <LanguageSwitcher />
          <ThemeToggle />
          <Separator orientation="vertical" className="h-6" />
          <AuthStatus />
        </div>
        {children}
      </main>
    </div>
  )
}
