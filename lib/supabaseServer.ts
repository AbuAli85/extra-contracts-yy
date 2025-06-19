import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export function createServerComponentClient() {
  const cookieStore = cookies()
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co"
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "public-anon-key"

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn(
      "Supabase URL or Anon Key is missing. Using placeholder credentials.",
    )
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options) {
        cookieStore.delete({ name, ...options })
      },
    },
  })
}
