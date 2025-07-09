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
