"use client"

import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"

// Create a client
const queryClient = new QueryClient()

export function ClientLayout({ children, messages }: { children: React.ReactNode; messages: any }) {
  const pathname = usePathname()

  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </NextIntlClientProvider>
    </QueryClientProvider>
  )
}

export default ClientLayout
