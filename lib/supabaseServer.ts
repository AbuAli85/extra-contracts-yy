import { createServerComponentClient as _createServerComponentClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'
import type { Database } from '@/types/supabase'

export const createServerComponentClient = () =>
  _createServerComponentClient<Database>({
    cookies,
    headers,
  })
