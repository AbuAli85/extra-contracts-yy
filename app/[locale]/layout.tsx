import "../globals.css"
import type React from "react"

   export default function Layout({ children, params }: { children: React.ReactNode, params: { locale: string } }) {
     // use params.locale directly
   }
  return <>{children}</>
}
