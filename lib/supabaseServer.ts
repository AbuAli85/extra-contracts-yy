import { cookies } from 'next/headers'
import { createServerComponentClient as createClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export const createServerComponentClient = () => {
  const cookieStore = cookies()
  return createClient<Database>({
    cookies: () => cookieStore,
  })
}
