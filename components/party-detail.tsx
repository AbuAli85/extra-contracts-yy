import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useUserRole } from '../hooks/useUserRole'

export default function PartyDetail({ partyId }) {
  const [user, setUser] = useState<any>(null)
  const role = useUserRole()
  const [notes, setNotes] = useState([])
  const [tags, setTags] = useState([])
  const [activities, setActivities] = useState([])
  const [noteInput, setNoteInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [ownerId, setOwnerId] = useState(null)
  const [users, setUsers] = useState([])

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
  const [files, setFiles] = useState([])
  const fileInputRef = useRef()

  useEffect(() => {
    // Fetch notes, tags, activities, and party owner
    supabase.from('party_notes').select('*').eq('party_id', partyId).then(({ data }) => setNotes(data || []))
    supabase.from('party_tags').select('*').eq('party_id', partyId).then(({ data }) => setTags(data || []))
    supabase.from('party_activities').select('*').eq('party_id', partyId).then(({ data }) => setActivities(data || []))
    supabase.from('parties').select('owner_id').eq('id', partyId).single().then(({ data }) => setOwnerId(data?.owner_id || null))
    supabase.from('profiles').select('id, full_name').then(({ data }) => setUsers(data || []))
    supabase.from('party_files').select('*').eq('party_id', partyId).then(({ data }) => setFiles(data || []))
  }, [partyId])

  const addNote = async () => {
    if (!noteInput) return
    await supabase.from('party_notes').insert({ party_id: partyId, user_id: user.id, note: noteInput })
    setNoteInput('')
    supabase.from('party_notes').select('*').eq('party_id', partyId).then(({ data }) => setNotes(data || []))
  }

  const addTag = async () => {
    if (!tagInput) return
    await supabase.from('party_tags').insert({ party_id: partyId, tag: tagInput })
    setTagInput('')
    supabase.from('party_tags').select('*').eq('party_id', partyId).then(({ data }) => setTags(data || []))
  }

  const changeOwner = async (newOwnerId) => {
    await supabase.from('parties').update({ owner_id: newOwnerId }).eq('id', partyId)
    setOwnerId(newOwnerId)
  }

  const uploadFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const filePath = `${partyId}/${Date.now()}_${file.name}`
    const { data, error } = await supabase.storage.from('party-files').upload(filePath, file)
    if (error) return alert('Upload error: ' + error.message)
    const fileUrl = supabase.storage.from('party-files').getPublicUrl(filePath).data.publicUrl
    await supabase.from('party_files').insert({
      party_id: partyId,
      user_id: user.id,
      file_name: file.name,
      file_url: fileUrl
    })
    supabase.from('party_files').select('*').eq('party_id', partyId).then(({ data }) => setFiles(data || []))
  }

  const deleteFile = async (file) => {
    // Only allow if user is uploader, party owner, or admin
    if (
      user.id === file.user_id ||
      user.id === ownerId ||
      role === 'admin'
    ) {
      // Remove from storage
      const filePath = file.file_url.split('/party-files/')[1]
      await supabase.storage.from('party-files').remove([filePath])
      // Remove from DB
      await supabase.from('party_files').delete().eq('id', file.id)
      supabase.from('party_files').select('*').eq('party_id', partyId).then(({ data }) => setFiles(data || []))
    } else {
      alert('You do not have permission to delete this file.')
    }
  }

  return (
    <div>
      <h2>Party Details</h2>
      <div>
        <label>Owner:</label>
        <select value={ownerId || ''} onChange={e => changeOwner(e.target.value)}>
          <option value=''>Unassigned</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
        </select>
      </div>
      <div>
        <h3>Notes</h3>
        <ul>
          {notes.map(n => <li key={n.id}>{n.note}</li>)}
        </ul>
        <input value={noteInput} onChange={e => setNoteInput(e.target.value)} placeholder='Add note...' />
        <button onClick={addNote}>Add Note</button>
      </div>
      <div>
        <h3>Tags</h3>
        <ul>
          {tags.map(t => <li key={t.id}>{t.tag}</li>)}
        </ul>
        <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder='Add tag...' />
        <button onClick={addTag}>Add Tag</button>
      </div>
      <div>
        <h3>Activity Log</h3>
        <ul>
          {activities.map(a => <li key={a.id}>{a.activity_type}: {a.details}</li>)}
        </ul>
      </div>
      <div>
        <h3>Files</h3>
        <input type="file" ref={fileInputRef} onChange={uploadFile} />
        <ul>
          {files.map(f => (
            <li key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Preview logic */}
              {f.file_name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img src={f.file_url} alt={f.file_name} style={{ width: 40, height: 40, objectFit: 'cover' }} />
              ) : f.file_name.match(/\.pdf$/i) ? (
                <span style={{ fontSize: 24, marginRight: 8 }}>📄</span>
              ) : null}
              <a href={f.file_url} target="_blank" rel="noopener noreferrer">{f.file_name}</a>
              {(user.id === f.user_id || user.id === ownerId || role === 'admin') && (
                <button onClick={() => deleteFile(f)} style={{ marginLeft: 8, color: 'red' }}>Delete</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 