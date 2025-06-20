import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./client-layout"
import "@/app/globals.css"

export const metadata: Metadata = {
  // Metadata should be in a server component or page.tsx
  title: "Bilingual Contract Generator",
  description: "Generate and manage bilingual contracts efficiently.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return <ClientLayout params={params}>{children}</ClientLayout>
}
