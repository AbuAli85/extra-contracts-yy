import createMiddleware from "next-intl/middleware"
import { createMiddlewareClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/supabase"

export default createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "es"],

  // Used when no locale matches
  defaultLocale: "en",
})

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createMiddlewareClient<Database>({ req: request, res: response })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const publicPaths = ["/login", "/auth/callback", "/"] // Add other public paths as needed

  // Check if the current path (without locale prefix) is a public path
  const pathnameWithoutLocale = request.nextUrl.pathname.split("/").slice(2).join("/")

  const isPublicPath =
    publicPaths.includes(pathnameWithoutLocale) ||
    publicPaths.some((path) => pathnameWithoutLocale.startsWith(path + "/"))

  if (!session && !isPublicPath) {
    const loginUrl = new URL("/login", request.url)
    // Preserve the locale in the redirect URL if it was present
    const locale = request.nextUrl.pathname.split("/")[1]
    if (["en", "es"].includes(locale)) {
      loginUrl.pathname = `/${locale}/login`
    } else {
      loginUrl.pathname = `/${"en"}/login`
    }
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(en|es)/:path*"],
}
