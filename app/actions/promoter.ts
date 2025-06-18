'use server'

import { createServerComponentClient } from '@/lib/supabaseServer'
import type { Database } from '@/types/supabase'

export async function createPromoter(data: Database['public']['Tables']['promoters']['Insert']) {
  const supabase = createServerComponentClient()
  const { error } = await supabase.from('promoters').insert(data)
  if (error) throw new Error(error.message)
}

export async function updatePromoter(id: string, data: Database['public']['Tables']['promoters']['Update']) {
  const supabase = createServerComponentClient()
  const { error } = await supabase.from('promoters').update(data).eq('id', id)
  if (error) throw new Error(error.message)
}
