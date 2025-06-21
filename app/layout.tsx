"use client"

import "./globals.css"
import type { ReactNode } from "react"

interface ClientLayoutProps {
  children: ReactNode
  params: { locale: string }
}

export default function ClientLayout({ children, params }: ClientLayoutProps) {
  return (
    <html lang={params.locale || "en"}>
      <body>
        {children}
      </body>
    </html>
  )
}
