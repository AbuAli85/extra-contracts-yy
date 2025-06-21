import "./globals.css"
import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Bilingual Contract Generator",
  description: "Generate and manage bilingual contracts efficiently.",
}

interface RootLayoutProps {
  children: ReactNode
  params: { locale: string }
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  return (
    <html lang={params.locale || "en"}>
      <body>
        {children}
      </body>
    </html>
  )
}
