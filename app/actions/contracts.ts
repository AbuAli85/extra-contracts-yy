'use server'

import { createServerComponentClient } from '@/lib/supabaseServer'
import type { Database } from '@/types/supabase'

export async function createContract(data: Database['public']['Tables']['contracts']['Insert']) {
  const supabase = createServerComponentClient()
  const { data: result, error } = await supabase.from('contracts').insert(data).select().single()
  if (error) throw new Error(error.message)
  return result
}

export async function deleteContract(id: string) {
  const supabase = createServerComponentClient()
  const { error } = await supabase.from('contracts').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
