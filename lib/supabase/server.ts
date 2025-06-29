import { createServerClient, type CookieOptions } from "@supabase/ssr"
import type { cookies } from "next/headers"
import type { Database } from "@/types/supabase"
import { devLog } from "@/lib/dev-log"

export function createClient(cookieStore: ReturnType<typeof cookies>) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `cookies().set()` method can't be called from a Client Component if you're also using it in a Server Component with the "headers" option.
            // This is because Next.js caches the rendered result of a Server Component, and calling `cookies().set()` from the client would break that cache.
            // For more info: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options
            devLog("Error setting cookie from server client:", error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            devLog("Error removing cookie from server client:", error)
          }
        },
      },
    },
  )
}
