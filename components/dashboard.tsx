import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const [stats, setStats] = useState({ parties: 0, files: 0, notes: 0 })
  const [recent, setRecent] = useState([])

  useEffect(() => {
    async function fetchStats() {
      const { count: partyCount } = await supabase.from('parties').select('*', { count: 'exact', head: true })
      const { count: fileCount } = await supabase.from('party_files').select('*', { count: 'exact', head: true })
      const { count: noteCount } = await supabase.from('party_notes').select('*', { count: 'exact', head: true })
      setStats({ parties: partyCount || 0, files: fileCount || 0, notes: noteCount || 0 })
      const { data: activities } = await supabase.from('party_activities').select('*').order('created_at', { ascending: false }).limit(10)
      setRecent(activities || [])
    }
    fetchStats()
  }, [])

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex', gap: 32 }}>
        <div>
          <h2>Total Parties</h2>
          <div style={{ fontSize: 32 }}>{stats.parties}</div>
        </div>
        <div>
          <h2>Total Files</h2>
          <div style={{ fontSize: 32 }}>{stats.files}</div>
        </div>
        <div>
          <h2>Total Notes</h2>
          <div style={{ fontSize: 32 }}>{stats.notes}</div>
        </div>
      </div>
      <div style={{ marginTop: 32 }}>
        <h2>Recent Activity</h2>
        <ul>
          {recent.map(a => (
            <li key={a.id}>{a.activity_type}: {a.details} ({new Date(a.created_at).toLocaleString()})</li>
          ))}
        </ul>
      </div>
    </div>
  )
} 