import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

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

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
