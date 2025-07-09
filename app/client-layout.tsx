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

<<<<<<< HEAD
export default async function ClientLayout({
=======
export default function ClientLayout({
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
<<<<<<< HEAD
  const { locale } = await params
=======
  const { locale } = params
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
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
<<<<<<< HEAD
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
=======
          fontLexend.variable
        )}
      >
        <ClientProviders>
          <ClientHeader locale={locale} />
          <Suspense fallback={<Loading />}>{children}</Suspense>
          <ClientFooter />
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
        </ClientProviders>
      </body>
    </html>
  )
}
