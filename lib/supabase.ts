import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Warn during import so tests or tooling without env vars don't immediately fail
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. " +
      "Create a `.env.local` file based on `env.example`."
  )
}

let browserClient: SupabaseClient<Database> | null = null

/**
 * Returns a singleton Supabase client for browser usage.
 * Throws an error if the required environment variables are not defined.
 */
export function createBrowserClient(): SupabaseClient<Database> {
  if (browserClient) return browserClient
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase URL or Anon Key is missing. Copy `env.example` to `.env.local` " +
        "and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    )
  }

  browserClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return browserClient
}
