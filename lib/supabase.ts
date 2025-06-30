import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Ensure these are defined in your .env.local or environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment."
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
