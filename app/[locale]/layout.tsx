<<<<<<< HEAD
import "../globals.css"
import type React from "react"

export default async function Layout({ 
  children, 
  params 
}: { 
  children: React.ReactNode
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params
  // You can use locale here if needed
  return <>{children}</>
}
=======
import "../globals.css"
import type React from "react"
import ClientLayout from "../client-layout"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()
  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      <ClientLayout params={params}>{children}</ClientLayout>
    </NextIntlClientProvider>
  )
}
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
