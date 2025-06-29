import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Ensure these are defined in your .env.local or environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL and Anon Key must be defined in environment variables.")
  // In a real application, you might throw an error or handle this more gracefully
  // For development, we'll proceed with undefined which will likely cause runtime errors
}

export const supabase = createClient<Database>(supabaseUrl || "", supabaseAnonKey || "")
