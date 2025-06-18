import { createServerClient, type SupabaseClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

/**
 * Returns a Supabase client configured for server-side usage.
 * A new client is created on each call to avoid sharing state between requests.
 */
export function supabaseServer(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Supabase URL or Anon Key is missing. Check your environment variables."
    )
    throw new Error(
      "Supabase URL or Anon Key is missing. Application cannot connect to the database."
    )
  }

  const cookieStore = cookies()

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
      }
    }
  })
}
