<<<<<<< HEAD
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useUserRole() {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

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
=======
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useUserRole() {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

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
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
} 