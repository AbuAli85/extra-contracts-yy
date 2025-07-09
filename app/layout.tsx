import './globals.css'
import type React from "react"
import type { Metadata } from "next"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "Bilingual Contract Generator",
  description: "Generate and manage bilingual contracts efficiently.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Providers>{children}</Providers>
}
