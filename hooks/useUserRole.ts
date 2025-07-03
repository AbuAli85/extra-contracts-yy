import { useUser } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useUserRole() {
  const user = useUser()
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        .then(({ data }) => setRole(data?.role ?? null))
    }
  }, [user])

  return role
} 