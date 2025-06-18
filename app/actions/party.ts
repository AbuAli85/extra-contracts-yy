'use server'

import { createServerComponentClient } from '@/lib/supabaseServer'
import type { Database } from '@/types/supabase'

export async function createParty(data: Database['public']['Tables']['parties']['Insert']) {
  const supabase = createServerComponentClient()
  const { error } = await supabase.from('parties').insert(data)
  if (error) throw new Error(error.message)
}

export async function updateParty(id: string, data: Database['public']['Tables']['parties']['Update']) {
  const supabase = createServerComponentClient()
  const { error } = await supabase.from('parties').update(data).eq('id', id)
  if (error) throw new Error(error.message)
}
