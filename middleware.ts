import { createMiddlewareClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/supabase"
import createIntlMiddleware from "next-intl/middleware"

const locales = ["en", "es"]
const defaultLocale = "en"

const handleI18nRouting = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed", // or 'always' or 'never'
})

export async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request) as NextResponse

  const supabase = createMiddlewareClient<Database>({ req: request, res: response })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const publicPaths = ["/login", "/auth/callback", "/"] // Add other public paths as needed

  // Check if the current path (without locale prefix) is a public path
  const pathnameWithoutLocale = locales.reduce((path, locale) => {
    if (path.startsWith(`/${locale}`)) {
      return path.substring(locale.length + 1)
    }
    return path
  }, request.nextUrl.pathname)

  const isPublicPath =
    publicPaths.includes(pathnameWithoutLocale) ||
    publicPaths.some((path) => pathnameWithoutLocale.startsWith(path + "/"))

  if (!session && !isPublicPath) {
    const loginUrl = new URL("/login", request.url)
    // Preserve the locale in the redirect URL if it was present
    const locale = request.nextUrl.pathname.split("/")[1]
    if (locales.includes(locale)) {
      loginUrl.pathname = `/${locale}/login`
    } else {
      loginUrl.pathname = `/${defaultLocale}/login`
    }
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    // Match all routes except static files and APIs
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/",
  ],
}
