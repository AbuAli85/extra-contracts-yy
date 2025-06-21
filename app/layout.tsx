import "./globals.css"
import type { ReactNode } from "react"
import type { Metadata } from "next"
import ClientLayout from "./client-layout"

export const metadata: Metadata = {
  title: "Bilingual Contract Generator",
  description: "Generate and manage bilingual contracts efficiently.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { locale: string }
}) {
  return <ClientLayout params={params}>{children}</ClientLayout>
}
