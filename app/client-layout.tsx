"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { NextIntlClientProvider } from "next-intl"
import type { AbstractIntlMessages } from "next-intl"
import { SupabaseListener } from "@/app/supabase-listener"

interface ClientLayoutProps {
  children: React.ReactNode
  messages: AbstractIntlMessages
  locale: string
}

// Changed to named export
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

// Default export
export default ClientLayout
