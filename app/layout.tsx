import './globals.css'
import type React from "react"
import type { Metadata } from "next"
<<<<<<< HEAD
import ClientLayout from "./client-layout"
=======
import { Providers } from "./providers"
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a

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
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
