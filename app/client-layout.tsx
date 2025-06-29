"use client"

import type React from "react"

import { ThemeProvider } from "next-themes"
import { NextIntlClientProvider } from "next-intl"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SupabaseListener } from "@/app/supabase-listener" // Ensure this is a named import

interface ClientLayoutProps {
  children: React.ReactNode
  messages: Record<string, string>
  locale: string
}

const ClientLayout = ({ children, messages, locale }: ClientLayoutProps) => {
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <SupabaseListener />
          {children}
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}

export default ClientLayout
