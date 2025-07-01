"use client"

import type React from "react"
import { Inter, Lexend } from "next/font/google" // Lexend as display font
import { Suspense } from "react"
import Loading from "./loading"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "./providers" // Assuming this includes ThemeProvider
import { LanguageSwitcher } from "@/components/language-switcher"
import { MobileNav } from "@/components/mobile-nav" // New component
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Twitter, Linkedin } from "lucide-react"

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

const navItems = [
  { title: "Home", href: "/" },
  { title: "Generate Contract", href: "/generate-contract" },
  { title: "View History", href: "/contracts" },
  { title: "Manage Parties", href: "/manage-parties" },
  { title: "Manage Promoters", href: "/manage-promoters" },
]

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
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
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            {/* HEADER */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 shadow-subtle-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center justify-between">
                {" "}
                {/* Increased height to 64px (h-16) */}
                <Link href={`/${locale}`} className="font-heading text-2xl font-bold text-primary">
                  ContractGen
                </Link>
                <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
                  {navItems.map((item) => (
                    <Link
                      key={item.title}
                      href={`/${locale}${item.href === "/" ? "" : item.href}`}
                      className="text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>
                <div className="flex items-center space-x-3">
                  <LanguageSwitcher />
                  <div className="md:hidden">
                    <MobileNav navItems={navItems} locale={locale} />
                  </div>
                </div>
              </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1">
              <Suspense fallback={<Loading />}>
                <div className="container py-8 md:py-12">{children}</div>
              </Suspense>
            </main>

            {/* FOOTER */}
            <footer className="border-t border-border/40 bg-secondary/50">
              <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                  <p className="text-center text-sm leading-loose text-muted-foreground md:text-start">
                    © {new Date().getFullYear()} ContractGen. All rights reserved.
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                    >
                      <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </a>
                  </Button>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
