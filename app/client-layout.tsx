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

export default function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // If params is a promise, resolve it (for SSR/async usage)
  const [locale, setLocale] = React.useState<string>("en")
  React.useEffect(() => {
    ;(async () => {
      const resolved = await params
      setLocale(resolved.locale)
    })()
  }, [params])
  const dir = locale === "ar" ? "rtl" : "ltr"

  return (
    <div className={cn(fontInter.variable, fontLexend.variable)} dir={dir}>
      <ClientProviders>
        <ClientHeader />
        <main className="min-h-screen flex flex-col">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </main>
        <ClientFooter />
      </ClientProviders>
    </div>
  )
}
