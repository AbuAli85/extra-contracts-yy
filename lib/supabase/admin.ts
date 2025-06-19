import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

let supabaseAdminInstance: SupabaseClient<Database> | null = null

export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (supabaseAdminInstance) {
    return supabaseAdminInstance
  }

  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error(
      "Supabase URL or Service Role Key is missing. Ensure PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.",
    )
    throw new Error(
      "Supabase URL or Service Role Key is missing. Application cannot connect to the database securely on the server.",
    )
  }

  supabaseAdminInstance = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return supabaseAdminInstance
}
