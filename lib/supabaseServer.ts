import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export function createServerComponentClient() {
  const cookieStore = cookies()
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Supabase URL or Anon Key is missing. Ensure PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY are set.",
    )
    throw new Error("Supabase credentials are missing")
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
