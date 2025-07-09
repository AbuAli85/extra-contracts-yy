// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js"

<<<<<<< HEAD
/** 
=======
/**
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
 * Single shared Supabase client instance.
 * Never recreate this on every render.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
<<<<<<< HEAD
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
=======
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
)
