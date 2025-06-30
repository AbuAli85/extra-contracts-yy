import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// This client is intended for server-side use where the service role key is safe.
// DO NOT expose SUPABASE_SERVICE_ROLE_KEY to the client-side.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Supabase URL and Service Role Key must be defined in environment variables for server-side operations.",
  )
}

export const supabaseAdmin = createClient<Database>(supabaseUrl || "", supabaseServiceRoleKey || "", {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
