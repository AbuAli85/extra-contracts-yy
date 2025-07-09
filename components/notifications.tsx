<<<<<<< HEAD
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Notifications() {
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState([])

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
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .then(({ data }) => setNotifications(data || []))
    }
  }, [user])

  const markAsRead = async (id) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifications(notifications.filter(n => n.id !== id))
  }

  if (!user) return null
  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {notifications.map(n => (
          <li key={n.id}>
            {n.message}
            <button onClick={() => markAsRead(n.id)} style={{ marginLeft: 8 }}>Mark as read</button>
          </li>
        ))}
        {notifications.length === 0 && <li>No new notifications.</li>}
      </ul>
    </div>
  )
} 
=======
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Notification } from '../lib/notification-types'

export default function Notifications() {
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])

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
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .then(({ data }) => setNotifications(
          (data || []).map(n => ({
            ...n,
            read: n.read ?? false,
          }))
        ))
    }
  }, [user])

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifications(notifications.filter(n => n.id !== id))
  }

  if (!user) return null
  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {notifications.map(n => (
          <li key={n.id}>
            {n.message}
            <button onClick={() => markAsRead(n.id)} style={{ marginLeft: 8 }}>Mark as read</button>
          </li>
        ))}
        {notifications.length === 0 && <li>No new notifications.</li>}
      </ul>
    </div>
  )
}
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
