import { createClient as createBrowserClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
  if (!supabaseAnonKey) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY")

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
