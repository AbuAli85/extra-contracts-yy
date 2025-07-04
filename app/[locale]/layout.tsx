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
