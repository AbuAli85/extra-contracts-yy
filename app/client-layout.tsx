import type React from "react"
import { Inter, Lexend } from "next/font/google" // Lexend as display font
import { Suspense } from "react"
import Loading from "./loading"
import { ClientProviders } from "@/components/client-providers"
import { ClientHeader } from "@/components/client-header"
import { ClientFooter } from "@/components/client-footer"
import { cn } from "@/lib/utils"

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const fontLexend = Lexend({
  // Example display font
  subsets: ["latin"],
  variable: "--font-lexend",
  weight: ["400", "500", "600", "700"],
})

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = params
  const dir = locale === "ar" ? "rtl" : "ltr"

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        {/* Include font links if not handled by next/font automatically for all weights */}
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontInter.variable,
          fontLexend.variable,
        )}
        suppressHydrationWarning
      >
        <ClientProviders>
          <div className="relative flex min-h-screen flex-col">
            {/* HEADER */}
            <ClientHeader locale={locale} />

            {/* MAIN CONTENT */}
            <main className="flex-1">
              <Suspense fallback={<Loading />}>
                <div className="container py-8 md:py-12">{children}</div>
              </Suspense>
            </main>

            {/* FOOTER */}
            <ClientFooter />
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}
