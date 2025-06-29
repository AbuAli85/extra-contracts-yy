"use client"

import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SupabaseListener } from "@/app/supabase-listener"
import { usePathname } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { pick } from "lodash"

// Create a client
const queryClient = new QueryClient()

export function ClientLayout({ children, messages }: { children: React.ReactNode; messages: any }) {
  const pathname = usePathname()

  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider messages={pick(messages, pathname)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SupabaseListener />
          {children}
          <Toaster />
        </ThemeProvider>
      </NextIntlClientProvider>
    </QueryClientProvider>
  )
}

export default ClientLayout
