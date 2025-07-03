import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabaseClient'

export default function Notifications() {
  const user = useUser()
  const [notifications, setNotifications] = useState([])

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