import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { saveAs } from 'file-saver'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE', '#FF6699']

function exportCSV(data, filename) {
  const csv = [Object.keys(data[0]).join(','), ...data.map(row => Object.values(row).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, filename)
}

export default function Dashboard() {
  const [stats, setStats] = useState({ parties: 0, files: 0, notes: 0 })
  const [recent, setRecent] = useState([])
  const [statusData, setStatusData] = useState([])
  const [filesPerMonth, setFilesPerMonth] = useState([])
  const [notesPerUser, setNotesPerUser] = useState([])
  const [filters, setFilters] = useState({ from: '', to: '', owner: '', status: '' })

  useEffect(() => {
    async function fetchStats() {
      const { count: partyCount } = await supabase.from('parties').select('*', { count: 'exact', head: true })
      const { count: fileCount } = await supabase.from('party_files').select('*', { count: 'exact', head: true })
      const { count: noteCount } = await supabase.from('party_notes').select('*', { count: 'exact', head: true })
      setStats({ parties: partyCount || 0, files: fileCount || 0, notes: noteCount || 0 })
      const { data: activities } = await supabase.from('party_activities').select('*').order('created_at', { ascending: false }).limit(10)
      setRecent(activities || [])
      // Parties by status
      const { data: statusRows } = await supabase.from('parties').select('status, count:id').group('status')
      setStatusData((statusRows || []).map(r => ({ name: r.status, value: r.count })))
      // Files per month
      const { data: fileRows } = await supabase.rpc('files_per_month')
      setFilesPerMonth(fileRows || [])
      // Notes per user
      const { data: noteRows } = await supabase.from('party_notes').select('user_id, count:id').group('user_id')
      setNotesPerUser((noteRows || []).map(r => ({ name: r.user_id, value: r.count })))
    }
    fetchStats()
  }, [filters])

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
      <div style={{ marginTop: 32, display: 'flex', gap: 32 }}>
        <div>
          <h3>Parties by Status</h3>
          <ResponsiveContainer width={300} height={200}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <button onClick={() => exportCSV(statusData, 'parties_by_status.csv')}>Export CSV</button>
        </div>
        <div>
          <h3>Files Uploaded Per Month</h3>
          <ResponsiveContainer width={300} height={200}>
            <BarChart data={filesPerMonth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <button onClick={() => exportCSV(filesPerMonth, 'files_per_month.csv')}>Export CSV</button>
        </div>
        <div>
          <h3>Notes Per User</h3>
          <ResponsiveContainer width={300} height={200}>
            <BarChart data={notesPerUser}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
          <button onClick={() => exportCSV(notesPerUser, 'notes_per_user.csv')}>Export CSV</button>
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