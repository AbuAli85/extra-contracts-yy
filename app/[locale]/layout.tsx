import "../globals.css"
import type React from "react"

   export default function Layout({ children, params }: { children: React.ReactNode, params: { locale: string } }) {
  // You can use params.locale here if needed
  return <>{children}</>
}
