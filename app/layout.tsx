import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { locales } from "@/navigation"
import { ClientLayout } from "./client-layout" // Named import

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bilingual Contract Generator",
  description: "Generate and manage bilingual contracts with ease.",
    generator: 'v0.dev'
}

interface RootLayoutProps {
  children: React.ReactNode
  params: {
    locale: string
  }
}

export default async function RootLayout({ children, params: { locale } }: RootLayoutProps) {
  if (!locales.includes(locale as any)) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout messages={messages} locale={locale}>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
