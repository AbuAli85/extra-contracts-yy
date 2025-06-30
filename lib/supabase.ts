import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Ensure these are defined in your .env.local or environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL and Anon Key must be defined in environment variables.",
  )
}

export const supabase = createClient<Database>(supabaseUrl || "", supabaseAnonKey || "")
