import "../globals.css"
import type React from "react"
import ClientLayout from "../client-layout"

export default function LocaleLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode
  params: { locale: string }
}) {
  return <ClientLayout params={params}>{children}</ClientLayout>
}
