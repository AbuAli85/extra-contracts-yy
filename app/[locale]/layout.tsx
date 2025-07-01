import "../globals.css"
import type React from "react"

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return <>{children}</>
}
