import { useEffect, useState } from 'react'
import { useUserRole } from '../hooks/useUserRole'
import { supabase } from '../lib/supabase'

export default function AuditLogs() {
  const role = useUserRole()
  const [logs, setLogs] = useState([])

  useEffect(() => {
    if (role === 'admin') {
      supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
        .then(({ data }) => setLogs(data || []))
    }
  }, [role])

  if (role !== 'admin') return null
  return (
    <div>
      <h3>Audit Logs</h3>
      <ul>
        {logs.map(log => (
          <li key={log.id}>
            [{log.created_at}] {log.action} {log.entity_type} (ID: {log.entity_id}) - {log.details}
          </li>
        ))}
        {logs.length === 0 && <li>No logs found.</li>}
      </ul>
    </div>
  )
} 